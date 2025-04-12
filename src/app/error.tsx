'use client';

import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';

export default function Error() {
  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="space-y-4 rounded-lg p-6 text-center">
        <h1 className="h2">Oops! We hit a snag!</h1>
        <p className="description">{APP_NAME} is currently experiencing an issue. We&apos;re working on getting things back to normal.</p>
        <Button onClick={handleReset}>Try again</Button>
      </div>
    </div>
  );
}
