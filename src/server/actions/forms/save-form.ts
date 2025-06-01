'use server';

import {
  TFormBuilderSchema,
  ZFormItemSchema,
  ZOptionSchema,
} from '@/components/(admin)/forms/form-builder/types';
import { db } from '@/db';
import { formItems, forms, milestonesOnFormItems, options } from '@/db/schema';
import { diffObjects } from '@/lib/helpers/diff-objects';
import { and, eq } from 'drizzle-orm';
import { groupBy } from 'lodash';
import { z } from 'zod';

export async function saveForm({
  oldObj,
  newObj,
}: {
  oldObj: TFormBuilderSchema;
  newObj: TFormBuilderSchema;
}): Promise<void> {
  const diffs = diffObjects({ oldObj, newObj });
  const { remove, update, add } = groupBy(diffs, (diff) => diff.operation);

  await db.transaction(async (tx) => {
    // PROCESS REMOVALS
    if (remove && remove.length > 0) {
      for (const { path, value } of remove) {
        // only one formItem can be deleted in a single remove operation
        if (path[0] === 'formItems' && path.length === 1) {
          try {
            await tx.delete(formItems).where(eq(formItems.id, value.id));
          } catch (error) {
            console.error("Couldn't remove formItem: ", error);
          }
        }

        // path.length of 3 means we are removing one option; ["formItems", ${id}, "options"]
        if (path[2] === 'options' && path.length === 3) {
          try {
            await tx.delete(options).where(eq(options.id, value.id));
          } catch (error) {
            console.error("Couldn't remove option: ", error);
          }
        }

        if (path[2] === 'milestoneIds') {
          // value will be an array of milestoneIds that are getting removed
          try {
            for (const milestoneId of value) {
              await tx
                .delete(milestonesOnFormItems)
                .where(
                  and(
                    eq(milestonesOnFormItems.formItemId, path[1]),
                    eq(milestonesOnFormItems.milestoneId, milestoneId),
                  ),
                ); // path[1] is the formItem.id
            }
          } catch (error) {
            console.error("Couldn't remove milestone : ", error);
          }
        }
      }
    }

    // PROCESS ADDITIONS
    if (add && add.length > 0) {
      for (const { path, value } of add) {
        // path.length of 1 means we are adding to ["formItems"]
        if (path[0] === 'formItems' && path.length === 1) {
          // Check if the value has an 'item' property structure
          const formItemData = value.item
            ? { ...value.item, id: value.id }
            : value;

          // A brand new formItem may have options and milestones
          const parsed = ZFormItemSchema.parse(formItemData);

          if (
            parsed.type === 'MULTIPLE_CHOICE' ||
            parsed.type === 'SINGLE_CHOICE'
          ) {
            try {
              await tx
                .insert(formItems)
                .values({
                  id: parsed.id,
                  type: parsed.type,
                  formId: oldObj.id,
                  isRequired: parsed.isRequired,
                  isScored: parsed.isScored,
                  position: parsed.position,
                  text: parsed.text,
                })
                .onConflictDoNothing();
            } catch (error) {
              console.error(
                "Couldn't add MULTIPLE_CHOICE or SINGLE_CHOICE formItem: ",
                error,
              );
            }

            // Use Promise.all for options to insert them in parallel
            if (parsed.options && parsed.options.length > 0) {
              const optionPromises = parsed.options.map((option) =>
                tx
                  .insert(options)
                  .values({
                    id: option.id,
                    formItemId: parsed.id,
                    position: option.position,
                    pointValue: option.pointValue?.toString(), // float must be as string?
                    text: option.text,
                    isNa: option.isNa,
                  })
                  .onConflictDoNothing(),
              );

              try {
                await Promise.all(optionPromises);
              } catch (error) {
                console.error("Couldn't add options to new formItem: ", error);
              }
            }

            // Use Promise.all for milestones to insert them in parallel
            if (parsed.milestoneIds && parsed.milestoneIds.length > 0) {
              const milestonePromises = parsed.milestoneIds.map((milestoneId) =>
                tx
                  .insert(milestonesOnFormItems)
                  .values({
                    formItemId: parsed.id,
                    milestoneId,
                  })
                  .onConflictDoNothing(),
              );

              try {
                await Promise.all(milestonePromises);
              } catch (error) {
                console.error("Couldn't add milestones: ", error);
              }
            }
          }

          if (parsed.type === 'PARAGRAPH' || parsed.type === 'HEADER') {
            try {
              await tx
                .insert(formItems)
                .values({
                  id: parsed.id,
                  type: parsed.type,
                  formId: oldObj.id,
                  position: parsed.position,
                  text: parsed.text,
                })
                .onConflictDoNothing();
            } catch (error) {
              console.error(
                "Couldn't add PARAGRAPH or HEADER formItem: ",
                error,
              );
            }
          }

          if (parsed.type === 'WRITTEN') {
            try {
              await tx
                .insert(formItems)
                .values({
                  id: parsed.id,
                  formId: oldObj.id,
                  type: parsed.type,
                  position: parsed.position,
                  text: parsed.text,
                  isRequired: parsed.isRequired,
                })
                .onConflictDoNothing();
            } catch (error) {
              console.error("Couldn't add WRITTEN formItem: ", error);
            }
          }

          if (parsed.type === 'RANGE') {
            try {
              await tx
                .insert(formItems)
                .values({
                  id: parsed.id,
                  formId: oldObj.id,
                  type: parsed.type,
                  position: parsed.position,
                  text: parsed.text,
                  isRequired: parsed.isRequired,
                  isScored: parsed.isScored,
                  minValue: parsed.minValue,
                  maxValue: parsed.maxValue,
                })
                .onConflictDoNothing();
            } catch (error) {
              console.error("Couldn't add RANGE formItem: ", error);
            }

            // Use Promise.all for milestones to insert them in parallel
            if (parsed.milestoneIds && parsed.milestoneIds.length > 0) {
              const milestonePromises = parsed.milestoneIds.map((milestoneId) =>
                tx
                  .insert(milestonesOnFormItems)
                  .values({
                    formItemId: parsed.id,
                    milestoneId,
                  })
                  .onConflictDoNothing(),
              );

              try {
                await Promise.all(milestonePromises);
              } catch (error) {
                console.error("Couldn't add milestones: ", error);
              }
            }
          }
        }

        // path.length of 3 means we are adding to ["formItems", ${id}, "options"]
        if (path[2] === 'options' && path.length === 3) {
          // Check if the value has an 'item' property structure
          const optionItemData = value.item
            ? { ...value.item, id: value.id }
            : value;

          const parsed = ZOptionSchema.parse(optionItemData);
          try {
            await tx
              .insert(options)
              .values({
                id: parsed.id,
                formItemId: path[1], // will be the formItem.id
                position: parsed.position,
                pointValue: parsed.pointValue?.toString(), // float must be as string?
                text: parsed.text,
                isNa: parsed.isNa,
              })
              .onConflictDoNothing();
          } catch (error) {
            console.error("Couldn't add option: ", error);
          }
        }

        // path.length of 3 means we are adding to ["formItems", ${id}, "milestoneIds"]
        if (path[2] === 'milestoneIds' && path.length === 3) {
          const parsed = z.array(z.string().uuid()).parse(value);

          if (parsed.length > 0) {
            const milestonePromises = parsed.map((milestoneId) =>
              tx
                .insert(milestonesOnFormItems)
                .values({
                  formItemId: path[1], // path[1] will be the formItem.id
                  milestoneId,
                })
                .onConflictDoNothing(),
            );

            try {
              await Promise.all(milestonePromises);
            } catch (error) {
              console.error("Couldn't add milestones: ", error);
            }
          }
        }
      }
    }

    // PROCESS UPDATES
    if (update && update.length > 0) {
      for (const { path, value } of update) {
        // path.length of 2 means we are updating passingCriteria; ["settings", "passingCriteria"]
        if (path[0] === 'settings' && path.length === 2) {
          // the settings field is just JSON so we can slap the whole thing in there
          try {
            await tx
              .update(forms)
              .set({ settings: newObj.settings })
              .where(eq(forms.id, oldObj.id));
          } catch (error) {
            console.error("Couldn't update settings: ", error);
          }
        }

        if (path[0] === 'title') {
          const parsed = z.string().parse(value);

          try {
            await tx
              .update(forms)
              .set({ title: parsed })
              .where(eq(forms.id, oldObj.id));
          } catch (error) {
            console.error("Couldn't update title: ", error);
          }
        }

        // path.length of 3 means we are updating a direct property of a formItem; ["formItems", ${id}, text | position | ...]
        if (
          path[0] === 'formItems' &&
          path.length === 3 &&
          path[2] !== 'milestoneIds'
        ) {
          try {
            await tx
              .update(formItems)
              .set({ [path[2]]: value })
              .where(eq(formItems.id, path[1]));
          } catch (error) {
            console.error(
              `Couldn't update formItem's ${path[2]} to ${value}: `,
              error,
            );
          }
        }

        // path.length of 5 means we are updating a property of an option; ["formItems", ${id}, "options", ${optionId}, "text" | "position" | "pointValue" | ...]
        if (path[2] === 'options' && path.length === 5) {
          try {
            await tx
              .update(options)
              .set({ [path[4]]: value })
              .where(eq(options.id, path[3]));
          } catch (error) {
            console.error(
              `Couldn't update option's ${path[4]} to ${value}: `,
              error,
            );
          }
        }
      }
    }
  });
}
