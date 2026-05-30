"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  avatarUrl?: string;
  fullName: string;
  email: string;
};

export function UserMenuHeader({ avatarUrl, fullName, email }: Props) {
  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "US";

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(145deg,#061B33_0%,#10233B_100%)] p-4 text-center text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,180,56,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(89,147,182,0.16),transparent_34%)]" />
      <div className="flex justify-center">
        <Avatar className="relative h-14 w-14 border border-white/10 shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
          <AvatarImage src={avatarUrl} alt={fullName} />
          <AvatarFallback className="bg-[#5993B6]/18 font-black text-white">{initials}</AvatarFallback>
        </Avatar>
      </div>

      <div className="relative mt-2">
        <div className="text-sm font-black leading-5">{fullName}</div>
        <div className="text-xs text-white/58">{email}</div>
      </div>
    </div>
  );
}
