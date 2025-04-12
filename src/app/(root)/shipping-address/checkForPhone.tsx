// This component will handle the toast notification and redirection logic

'use client';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

function CheckForPhone() {
  const { toast } = useToast();
  useEffect(() => {
    toast({
      title: 'Update your phone number first.',
      description: 'You need to add your phone number before you can add your shipping address.',
    });

    // Redirect after showing the toast
    setTimeout(() => {
      window.location.href = '/user/profile';
    }, 3000); // Adjust delay as necessary
  }, [toast]);

  return (
    <div className="mt-4 flex items-center justify-center">
      <div className="loader"></div>
    </div>
  );
}

export default CheckForPhone;
