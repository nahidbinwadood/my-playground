'use client';

import { useAuthContext } from '@/providers/auth-provider';
import { Settings, User } from 'lucide-react';
import LogoutButton from '../common/logoutButton';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

// Build initials from a name, e.g. "Nahid Wadood" -> "NW". Falls back to "A".
const getInitials = (name?: string) =>
  name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'A';

const ProfileMenu = () => {
  const { user } = useAuthContext();
  const name = user?.name || 'Admin';
  const email = user?.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account menu for ${name}`}
          className="group rounded-md"
        >
          <Avatar className="size-9 rounded-md border border-line transition-colors group-hover:border-signal/40">
            <AvatarFallback className="rounded-md bg-surface font-mono text-xs font-medium tracking-tight text-foreground">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-60">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <Avatar className="size-8 shrink-0 rounded-md border border-line">
            <AvatarFallback className="rounded-md bg-surface font-mono text-[0.6875rem] font-medium tracking-tight text-foreground">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 gap-1">
            <p className="truncate text-sm leading-none font-medium">{name}</p>
            {email && (
              <p className="truncate font-mono text-[0.6875rem] leading-none text-muted-foreground">
                {email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="font-mono text-xs tracking-tight">
          <User aria-hidden="true" className="size-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="font-mono text-xs tracking-tight">
          <Settings aria-hidden="true" className="size-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
