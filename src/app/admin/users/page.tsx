import { auth } from '@/auth';
import DeleteDialog from '@/components/shared/admin/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions';
import { APP_NAME } from '@/lib/constants';
import { formatId } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: `Admin Users - ${APP_NAME}` };

export default async function AdminUser({ searchParams }: { searchParams: { page: string } }) {
  const session = await auth();
  if (session?.user.role !== 'admin') throw new Error('admin permission required');

  const page = Number(searchParams.page) || 1;
  const users = await getAllUsers({
    page,
  });
  return (
    <div className="space-y-2">
      <h1 className="h2-bold py-4 text-center">Users</h1>
      {users?.totalPages > 1 && (
        <div className="sticky top-0 z-50">
          <div className="flex-center py-2">
            <div className="w-fit rounded-full border-2 bg-secondary p-1">
              <Pagination page={page} totalPages={users?.totalPages} />
            </div>
          </div>
        </div>
      )}
      <div>
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>PHONE</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone && user.phone !== '' ? user.phone : 'N/A'}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <div className="flex-start gap-2">
                    <Link href={`/admin/users/${user.id}`}>
                      <Button size="icon" variant="outline">
                        <Pencil />
                      </Button>
                    </Link>
                    <DeleteDialog id={user.id} action={deleteUser} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* {users?.totalPages! > 1 && <Pagination page={page} totalPages={users?.totalPages!} />} */}
        {/* {users?.totalPages > 1 && <Pagination page={page} totalPages={users?.totalPages} />} */}
      </div>
    </div>
  );
}
