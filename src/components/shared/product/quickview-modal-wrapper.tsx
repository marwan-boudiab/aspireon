'use client';
import { XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react';

export default function QuickViewModalWrapper(props: PropsWithChildren) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    },
    [handleClose],
  );

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    },
    [handleClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onKeyDown, handleOutsideClick]);

  return (
    <div ref={modalRef}>
      <button onClick={() => router.back()} className="absolute right-2 top-2 z-50 rounded-full border-2 bg-destructive p-1">
        <XIcon />
      </button>
      {props.children}
    </div>
  );
}
