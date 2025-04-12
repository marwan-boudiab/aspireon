/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ShippingAddress } from '@/types';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingAddressSchema } from '@/lib/validator';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { useTransition, useState } from 'react';
import { updateUserAddress } from '@/lib/actions/user.actions';
import CheckoutSteps from '@/components/shared/checkout/checkout-steps';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import MapComponent from './map-component';

const reverseGeocode = async (lat: number, lng: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.address) {
      return {
        streetAddress: data.address.road || '',
        city: data.address.city || data.address.town || data.address.village || '',
        country: data.address.country || '',
        postalCode: data.address.postcode || '',
      };
    }
  } catch (error) {
    console.error('Error fetching address:', error);
  }
  return {};
};

export default function ShippingAddressForm({ address }: { address: ShippingAddress | null }) {
  const router = useRouter();
  const [, setLocationDetails] = useState<{ lat: number; lng: number } | null>(null);
  // const [locationDetails, setLocationDetails] = useState<{ lat: number; lng: number } | null>(null);

  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<ShippingAddress> = async (values) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);
      if (!res.success) {
        toast({ title: 'Unable to update shipping address', variant: 'destructive', description: res.message });
        return;
      }
      router.push('/payment-method');
    });
  };

  const setShippingLocation = async ({ lat, lng }: { lat: number; lng: number }) => {
    setLocationDetails({ lat, lng });
    form.setValue('lat', lat);
    form.setValue('lng', lng);

    // Reverse geocode the lat and lng to get address details
    const details = await reverseGeocode(lat, lng);
    if (details) {
      form.setValue('streetAddress', details.streetAddress || '');
      form.setValue('city', details.city || '');
      form.setValue('country', details.country || '');
      form.setValue('postalCode', details.postalCode || '');
    }
  };

  return (
    <>
      <CheckoutSteps current={1} />
      <div className="mx-auto max-w-md space-y-4 px-6 sm:px-0">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">Please enter the address that you want to ship to</p>
        <Form {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="city"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }: { field: any }) => (
                  <FormItem className="w-full">
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter postal code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <MapComponent onLocationSelect={setShippingLocation} initialLocation={address?.lat && address?.lng ? { lat: address.lat, lng: address.lng } : undefined} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                &nbsp;&nbsp;Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import { ShippingAddress } from '@/types';
// import { useRouter } from 'next/navigation';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { shippingAddressSchema } from '@/lib/validator';
// import { shippingAddressDefaultValues } from '@/lib/constants';
// import { useToast } from '@/hooks/use-toast';
// import { useTransition } from 'react';
// import { updateUserAddress } from '@/lib/actions/user.actions';
// import CheckoutSteps from '@/components/shared/checkout-steps';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { ArrowRight, Loader } from 'lucide-react';
// import MapComponent from '@/components/map-component';
// import reverseGeocode from '@/lib/utils';

// export default function ShippingAddressForm({ address }: { address: ShippingAddress | null }) {
//   const router = useRouter();

//   const form = useForm<ShippingAddress>({ resolver: zodResolver(shippingAddressSchema), defaultValues: address || shippingAddressDefaultValues });
//   const { toast } = useToast();

//   const [isPending, startTransition] = useTransition();
//   const onSubmit: SubmitHandler<ShippingAddress> = async (values) => {
//     startTransition(async () => {
//       const res = await updateUserAddress(values);
//       if (!res.success) {
//         toast({ variant: 'destructive', description: res.message });
//         return;
//       }
//       router.push('/payment-method');
//     });
//   };
//   // const setShippingLocation = ({ lat, lng }: { lat: number; lng: number }) => {
//   //   console.log(lat, lng);
//   //   form.setValue('lat', lat);
//   //   form.setValue('lng', lng);
//   // };

//   const setShippingLocation = async ({ lat, lng }: { lat: number; lng: number }) => {
//     console.log(lat, lng);
//     form.setValue('lat', lat);
//     form.setValue('lng', lng);

//     // Reverse geocode the lat and lng to get address details
//     const details = await reverseGeocode(lat, lng);
//     if (details) {
//       form.setValue('streetAddress', details.streetAddress || '');
//       form.setValue('city', details.city || '');
//       form.setValue('country', details.country || '');
//       form.setValue('postalCode', details.postalCode || '');
//     }
//   };

//   return (
//     <>
//       <CheckoutSteps current={1} />
//       <div className="mx-auto max-w-md space-y-4 px-6 sm:px-0">
//         <h1 className="h2-bold mt-4">Shipping Address</h1>
//         <p className="text-sm text-muted-foreground">Please enter the address that you want to ship to</p>
//         <Form {...form}>
//           <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <div className="flex flex-col gap-5 md:flex-row">
//               <FormField
//                 control={form.control}
//                 name="fullName"
//                 render={({ field }: { field: any }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Full Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter full name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <div>
//               <FormField
//                 control={form.control}
//                 name="streetAddress"
//                 render={({ field }: { field: any }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Address</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter address" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <div className="flex flex-col gap-5 md:flex-row">
//               <FormField
//                 control={form.control}
//                 name="city"
//                 render={({ field }: { field: any }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>City</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter city" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="country"
//                 render={({ field }: { field: any }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Country</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter country" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="postalCode"
//                 render={({ field }: { field: any }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Postal Code</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter postal code" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             {/* <div>
//               <ShippingAddressMap setShippingLocation={setShippingLocation} />
//             </div> */}
//             <div>
//               <MapComponent onLocationSelect={setShippingLocation} />
//             </div>
//             <div className="flex gap-2">
//               <Button type="submit" disabled={isPending}>
//                 {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
//                 &nbsp;&nbsp;Continue
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </>
//   );
// }

// 'use client';

// import { ShippingAddress } from '@/types';
// import { useRouter } from 'next/navigation';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { shippingAddressSchema } from '@/lib/validator';
// import { shippingAddressDefaultValues } from '@/lib/constants';
// import { useToast } from '@/hooks/use-toast';
// import { useTransition, useState } from 'react';
// import { updateUserAddress } from '@/lib/actions/user.actions';
// import CheckoutSteps from '@/components/shared/checkout-steps';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { ArrowRight, Loader } from 'lucide-react';
// import MapComponent from '@/components/map-component';

// export default function ShippingAddressForm({ address }: { address: ShippingAddress | null }) {
//   const router = useRouter();
//   const [locationDetails, setLocationDetails] = useState<{ lat: number; lng: number } | null>(null);

//   const form = useForm<ShippingAddress>({
//     resolver: zodResolver(shippingAddressSchema),
//     defaultValues: address || shippingAddressDefaultValues,
//   });
//   const { toast } = useToast();
//   const [isPending, startTransition] = useTransition();

//   const onSubmit: SubmitHandler<ShippingAddress> = async (values) => {
//     startTransition(async () => {
//       const res = await updateUserAddress(values);
//       if (!res.success) {
//         toast({ variant: 'destructive', description: res.message });
//         return;
//       }
//       router.push('/payment-method');
//     });
//   };

//   const setShippingLocation = ({ lat, lng }: { lat: number; lng: number }) => {
//     setLocationDetails({ lat, lng });
//     form.setValue('lat', lat);
//     form.setValue('lng', lng);
//   };

//   return (
//     <>
//       <CheckoutSteps current={1} />
//       <div className="mx-auto max-w-md space-y-4 px-6 sm:px-0">
//         <h1 className="h2-bold mt-4">Shipping Address</h1>
//         <p className="text-sm text-muted-foreground">Please enter the address that you want to ship to</p>
//         <Form {...form}>
//           <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <div className="flex flex-col gap-5 md:flex-row">
//               <FormField
//                 control={form.control}
//                 name="fullName"
//                 render={({ field }: { field: any }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Full Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter full name" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <div>
//               <FormField
//                 control={form.control}
//                 name="streetAddress"
//                 render={({ field }: { field: any }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Address</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter address" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <div className="flex flex-col gap-5 md:flex-row">
//               <FormField
//                 control={form.control}
//                 name="city"
//                 render={({ field }: { field: any }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>City</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter city" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="country"
//                 render={({ field }: { field: any }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Country</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter country" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="postalCode"
//                 render={({ field }: { field: any }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>Postal Code</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter postal code" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <div>
//               <MapComponent onLocationSelect={setShippingLocation} />
//               {locationDetails && (
//                 <div>
//                   <p>Latitude: {locationDetails.lat}</p>
//                   <p>Longitude: {locationDetails.lng}</p>
//                 </div>
//               )}
//             </div>
//             <div className="flex gap-2">
//               <Button type="submit" disabled={isPending}>
//                 {isPending ? <Loader className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
//                 &nbsp;&nbsp;Continue
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </>
//   );
// }
