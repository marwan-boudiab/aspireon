import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SignOut } from '@/lib/actions/user.actions';
import ModeToggle from './mode-toggle';
import { LogIn } from 'lucide-react';

export default async function UserButton() {
  const session = await auth();
  if (!session)
    return (
      <Button asChild className="border-2" size={'icon'}>
        <Link href="/api/auth/signin">
          <LogIn />
        </Link>
      </Button>
    );
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button size={'icon'} className="relative border-2">
              {session.user.image ? <Image width={64} height={64} src={session.user.image} alt={session.user.name || 'User avatar'} className="h-full w-full rounded-full object-cover" /> : <span>{session.user.name!.charAt(0).toUpperCase()}</span>}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="mb-2 border-b-2 pb-4 font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session.user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link className="w-full" href="/user/profile">
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link className="w-full" href="/user/orders">
              Order History
            </Link>
          </DropdownMenuItem>

          {session.user.role === 'admin' && (
            <DropdownMenuItem>
              <Link className="w-full" href="/admin/overview">
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="mb-1 p-0">
            <form action={SignOut} className="w-full">
              <Button className="h-4 w-full justify-start px-2 py-4" variant="ghost">
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
          <div className="mt-2">
            <ModeToggle />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
