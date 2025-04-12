import * as React from 'react';

import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(({ className, ...props }, ref) => {
  return <textarea className={cn('flex min-h-[140px] w-full rounded-md border-2 border-input bg-background px-3 py-2 text-base transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', className)} ref={ref} {...props} />;
});
Textarea.displayName = 'Textarea';

export { Textarea };
