// import { type PropsWithChildren } from 'react';

// import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';

// export default function Layout(props: PropsWithChildren) {
//   return (
//     <AlertDialog defaultOpen>
//       <AlertDialogContent className="min-w-xl max-h-[500px] w-5/6 max-w-2xl overflow-x-auto">{props.children}</AlertDialogContent>
//     </AlertDialog>
//   );
// }

import { type PropsWithChildren } from 'react';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';

export default function Layout(props: PropsWithChildren) {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent className="min-w-xl max-h-[calc(100vh - 2rem)] h-fit w-[calc(100%-2rem)] overflow-y-auto p-4 sm:h-auto sm:max-h-[500px] sm:w-5/6 sm:max-w-2xl">{props.children}</AlertDialogContent>
    </AlertDialog>
  );
}
