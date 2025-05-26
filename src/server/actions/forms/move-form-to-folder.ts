'use server';

import { db } from '@/db';
import { formFolders, forms } from '@/db/schema'; // Import folders table
import { eq } from 'drizzle-orm';

export async function moveFormToFolder({
  formId,
  folderId,
}: {
  formId: string;
  folderId: string | null;
}) {
  try {
    // First update the form
    const updateResult = await db
      .update(forms)
      .set({
        folderId,
      })
      .where(eq(forms.id, formId))
      .returning();

    if (updateResult.length === 0) {
      throw new Error('Form not found');
    }

    const updatedForm = updateResult[0];

    // If folderId is null, return form with folderTitle as null
    if (!folderId) {
      return {
        ...updatedForm,
        folderTitle: null,
      };
    }

    // Get the folder title
    const folder = await db
      .select({ title: formFolders.title })
      .from(formFolders)
      .where(eq(formFolders.id, folderId))
      .limit(1);

    return {
      ...updatedForm,
      folderTitle: folder[0]?.title || null,
    };
  } catch (error) {
    console.error('Error updating form folder:', error);
    throw new Error('Failed to update form folder');
  }
}
