import EasyTooltip from "@/components/ui/easy-tooltip";
import { cn } from "@/lib/helpers/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ClassValue } from "clsx";
import { ReactNode } from "react";

const avatarVariants = cva(
  "rounded-full border-2 p-2 border-white transition-all duration-400 flex items-center text-center flex-col justify-center",
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-12",
      },
      color: {
        accent: "bg-teal-600 text-white",
        border: "bg-white border-border border-[0.5px]",
        primary: "bg-primary text-white",
        yellow: "bg-yellow-100 text-yellow-800",
      },
    },
    defaultVariants: {
      size: "sm",
      color: "accent",
    },
  },
);

export type AvatarColor = VariantProps<typeof avatarVariants>["color"];

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  content: ReactNode;
  tooltip?: ReactNode;
  className?: ClassValue;
}

export function Avatar({
  content,
  tooltip,
  size,
  color,
  className,
}: AvatarProps) {
  const avatarContent = (
    <span className={cn(avatarVariants({ size, color }), className)}>
      {content}
    </span>
  );

  return tooltip ? (
    <EasyTooltip tooltipContent={tooltip}>{avatarContent}</EasyTooltip>
  ) : (
    avatarContent
  );
}

interface AvatarStackProps {
  avatars: AvatarProps[];
  maxAvatars?: number;
}

export function AvatarStack({ avatars, maxAvatars = 3 }: AvatarStackProps) {
  const visibleAvatars = avatars.slice(0, maxAvatars);
  const remainingCount = avatars.length - maxAvatars;

  return (
    <div className="relative flex flex-row items-center select-none -space-x-2.5">
      {visibleAvatars.map((avatar) => (
        <Avatar
          key={`avatar-${avatar.tooltip}`}
          {...avatar}
          className={cn(
            avatar.className,
            "shadow-sm hover:scale-125 hover:z-30 hover:shadow-xl",
          )}
        />
      ))}
      {remainingCount > 0 && (
        <Avatar
          content={`+${remainingCount}`}
          color="border"
          className="translate-x-2.5 border-0 shadow-sm z-40 hover:shadow-xl"
        />
      )}
    </div>
  );
}
