'use client';

import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../ui/alert-dialog';
import { Button } from '../../ui/button';
import { Trash2 } from 'lucide-react';

export default function DeleteDialog({
  id,
  action,
}: {
  id: string;
  // eslint-disable-next-line no-unused-vars
  action: (id: string) => Promise<{ success: boolean; message: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild className="hover:cursor-pointer">
        <Button size="icon" variant="destructive">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-xl w-[calc(100%-2rem)] overflow-y-auto p-4 sm:w-5/6 sm:max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const res = await action(id);
                if (!res.success) {
                  toast({
                    title: 'Unable to delete',
                    variant: 'destructive',
                    description: res.message,
                  });
                } else {
                  setOpen(false);
                  toast({
                    title: 'Deleted successfully',
                    description: res.message,
                  });
                }
              })
            }
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
