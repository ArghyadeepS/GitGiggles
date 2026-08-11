import { cn } from "@/lib/utils";

interface UserAvatarProps {
  username: string;
  avatarUrl?: string | null;
  className?: string;
}

export function Avatar({ username, avatarUrl, className }: UserAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`@${username}`}
        className={cn("border-2 border-foreground object-cover", className)}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid place-items-center border-2 border-foreground bg-primary font-mono text-sm font-bold text-primary-foreground uppercase",
        className,
      )}
    >
      {username.charAt(0).toUpperCase()}
    </span>
  );
}
