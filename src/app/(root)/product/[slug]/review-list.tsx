'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Calendar, Check, StarIcon, User } from 'lucide-react';
import Rating from '@/components/shared/product/rating';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createUpdateReview, getReviews, getUserReviewByProductId } from '@/lib/actions/review.actions';
import { reviewFormDefaultValues } from '@/lib/constants';
import { formatDateTime } from '@/lib/utils';
import { insertReviewSchema } from '@/lib/validator';
import { Review } from '@/types';

export default function ReviewList({ userId, productId, productSlug }: { userId: string; productId: string; productSlug: string }) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, inView } = useInView();
  const { toast } = useToast();

  const reload = async () => {
    setIsLoading(true);
    try {
      const res = await getReviews({ productId, page: 1 });
      setReviews([...res.data]);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error(err);
      toast({ title: 'Unable to fetch reviews', variant: 'destructive', description: 'Error in fetching reviews' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const fetchUserReview = async () => {
      try {
        const review = await getUserReviewByProductId({ productId });
        // Ensure that even if undefined is returned, we explicitly set null
        setUserReview(review ?? null);
      } catch (err) {
        console.error('Error fetching user review:', err);
      }
    };

    fetchUserReview();
  }, [userId, productId]); // Fetch only when `userId` or `productId` changes

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadMoreReviews = async () => {
      if (page === totalPages) return;
      try {
        const res = await getReviews({ productId, page });
        setReviews((prevReviews) => [...prevReviews, ...res.data]);
        setTotalPages(res.totalPages);
        if (page < res.totalPages) {
          setPage(page + 1);
        }
      } catch (error) {
        console.error(error);
        toast({ title: 'Unable to load more reviews', variant: 'destructive', description: 'Error loading more reviews' });
      }
    };

    if (inView && !isLoading) {
      loadMoreReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  type CustomerReview = z.infer<typeof insertReviewSchema>;

  const form = useForm<CustomerReview>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: reviewFormDefaultValues,
  });
  const [open, setOpen] = useState(false);

  const onSubmit = async (values: CustomerReview) => {
    const res = await createUpdateReview({ ...values, productId });
    // if (!res.success) return toast({ title: 'Unable to create review', variant: 'destructive', description: res.message });
    setOpen(false);
    reload();
    toast({ title: res.success ? 'Review created' : 'Unable to create review', variant: res.success ? 'default' : 'destructive', description: res.message });
  };

  const handleOpenForm = async () => {
    form.setValue('productId', productId);
    form.setValue('userId', userId);
    const review = await getUserReviewByProductId({ productId });
    if (review) {
      form.setValue('title', review.title);
      form.setValue('description', review.description);
      form.setValue('rating', review.rating);
    }
    setOpen(true);
  };

  // Loading skeleton component
  // const ReviewSkeleton = () => (
  //   <Card className="animate-pulse">
  //     <CardHeader>
  //       <div className="h-8 w-1/4 rounded-lg bg-secondary"></div>
  //       <div className="mt-2 h-20 w-full rounded-lg bg-secondary"></div>
  //     </CardHeader>
  //     <CardContent>
  //       <div className="flex gap-2">
  //         <div className="h-5 w-32 rounded-lg bg-secondary"></div>
  //         <div className="h-5 w-52 rounded-lg bg-secondary"></div>
  //       </div>
  //     </CardContent>
  //   </Card>
  // );
  // const ReviewSkeleton = () => (
  //   <Card className="animate-pulse">
  //     <CardHeader className="p-3">
  //       <div className="flex-between">
  //         <div className="h-6 w-1/4 rounded-lg bg-secondary"></div>
  //         <div className="flex text-sm italic">
  //           {/* <div className="h-4 w-4 rounded-full bg-secondary"></div> */}
  //           <div className="ml-2 h-4 w-24 rounded-lg bg-secondary"></div>
  //         </div>
  //       </div>
  //       <div className="mt-2 h-16 w-full rounded-lg bg-secondary"></div>
  //     </CardHeader>
  //     <CardFooter className="p-3">
  //       <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row">
  //         <div className="h-5 w-24 rounded-lg bg-secondary"></div>
  //         <div className="flex items-center">
  //           {/* <div className="mr-1 h-3 w-3 rounded-full bg-secondary"></div> */}
  //           <div className="h-4 w-24 rounded-lg bg-secondary"></div>
  //         </div>
  //         <div className="flex items-center">
  //           {/* <div className="mr-1 h-3 w-3 rounded-full bg-secondary"></div> */}
  //           <div className="h-4 w-24 rounded-lg bg-secondary"></div>
  //         </div>
  //       </div>
  //     </CardFooter>
  //   </Card>
  // );

  const Loading = () => (
    <div className="flex justify-center">
      <div className="loader"></div>
    </div>
  );

  return (
    <div className="space-y-4">
      {userId ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={handleOpenForm} variant="default">
            {userReview ? 'Edit your review' : 'Write a review'}
          </Button>

          {/* <DialogContent className="sm:max-w-[425px]"> */}
          <DialogContent className="min-w-xl max-h-[calc(100vh - 2rem)] h-[calc(100%-2rem)] w-[calc(100%-2rem)] overflow-y-auto p-4 sm:h-auto sm:max-h-[600px] sm:w-5/6 sm:max-w-2xl">
            <Form {...form}>
              <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle> {userReview ? 'Edit your review' : 'Write a review'}</DialogTitle>
                  <DialogDescription>share your thoughts with other customers</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-5">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a rating" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 5 }).map((_, index) => (
                                <SelectItem key={index} value={(index + 1).toString()}>
                                  <div className="flex items-center gap-1">
                                    {index + 1} <StarIcon className="h-4 w-4" />
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : (
        <div>
          Please
          <Link className="px-2 text-primary" href={`/api/auth/signin?callbackUrl=/product/${productSlug}`}>
            sign in
          </Link>
          to write a review
        </div>
      )}

      <div className="flex flex-col gap-3">
        {isLoading ? (
          // Show 3 skeleton cards while loading
          // Array.from({ length: 3 }).map((_, index) => <ReviewSkeleton key={index} />)
          // <ReviewSkeleton />
          <Loading />
        ) : reviews.length === 0 ? (
          <div>No reviews yet</div>
        ) : (
          <>
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader className="p-3">
                  <div className="flex-between">
                    <CardTitle className="text-xl">{review.title}</CardTitle>
                    <div className="flex text-sm italic">
                      <Check className="h-4 w-4" /> Verified Purchase
                    </div>
                  </div>
                  <div>
                    <CardDescription>{review.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="p-3">
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row">
                    <Rating value={review.rating} />
                    <div className="flex items-center">
                      <User className="mr-1 h-3 w-3" />
                      {review.user ? review.user.name : 'Deleted User'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDateTime(review.createdAt).dateOnly}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
            <div ref={ref}>
              {page < totalPages && (
                <div className="flex justify-center py-4">
                  <div className="animate-pulse">Loading more reviews...</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
// 'use client';

// import Rating from '@/components/shared/product/rating';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/hooks/use-toast';
// import { createUpdateReview, getReviews, getUserReviewByProductId } from '@/lib/actions/review.actions';
// import { reviewFormDefaultValues } from '@/lib/constants';
// import { formatDateTime } from '@/lib/utils';
// import { insertReviewSchema } from '@/lib/validator';
// import { Review } from '@/types';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Calendar, Check, StarIcon, User } from 'lucide-react';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { SubmitHandler, useForm } from 'react-hook-form';
// import { useInView } from 'react-intersection-observer';
// import { z } from 'zod';

// export default function ReviewList({ userId, productId, productSlug }: { userId: string; productId: string; productSlug: string }) {
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const { ref, inView } = useInView();
//   const reload = async () => {
//     try {
//       const res = await getReviews({ productId, page: 1 });
//       setReviews([...res.data]);
//       setTotalPages(res.totalPages);
//     } catch (err) {
//       console.error(err);
//       toast({ variant: 'destructive', description: 'Error in fetching reviews' });
//     }
//   };
//   useEffect(() => {
//     const loadMoreReviews = async () => {
//       if (page === totalPages) return;
//       const res = await getReviews({ productId, page });
//       setReviews([...reviews, ...res.data]);
//       setTotalPages(res.totalPages);
//       if (page < res.totalPages) {
//         setPage(page + 1);
//       }
//     };
//     if (inView) {
//       loadMoreReviews();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [inView]);

//   type CustomerReview = z.infer<typeof insertReviewSchema>;

//   const form = useForm<CustomerReview>({
//     resolver: zodResolver(insertReviewSchema),
//     defaultValues: reviewFormDefaultValues,
//   });
//   const [open, setOpen] = useState(false);
//   const { toast } = useToast();

//   const onSubmit: SubmitHandler<CustomerReview> = async (values) => {
//     const res = await createUpdateReview({ ...values, productId });
//     if (!res.success) return toast({ variant: 'destructive', description: res.message });
//     setOpen(false);
//     reload();
//     toast({
//       description: res.message,
//     });
//   };

//   const handleOpenForm = async () => {
//     form.setValue('productId', productId);
//     form.setValue('userId', userId);
//     const review = await getUserReviewByProductId({ productId });
//     if (review) {
//       form.setValue('title', review.title);
//       form.setValue('description', review.description);
//       form.setValue('rating', review.rating);
//     }
//     setOpen(true);
//   };

//   return (
//     <div className="space-y-4">
//       {reviews.length === 0 && <div>No reviews yet</div>}
//       {userId ? (
//         <Dialog open={open} onOpenChange={setOpen}>
//           <Button onClick={handleOpenForm} variant="default">
//             Write a review
//           </Button>

//           <DialogContent className="sm:max-w-[425px]">
//             <Form {...form}>
//               <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
//                 <DialogHeader>
//                   <DialogTitle>Write a review</DialogTitle>
//                   <DialogDescription>share your thoughts with other customers</DialogDescription>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="flex flex-col gap-5">
//                     <FormField
//                       control={form.control}
//                       name="title"
//                       render={({ field }) => (
//                         <FormItem className="w-full">
//                           <FormLabel>Title</FormLabel>
//                           <FormControl>
//                             <Input placeholder="Enter title" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="description"
//                       render={({ field }) => (
//                         <FormItem className="w-full">
//                           <FormLabel>Description</FormLabel>
//                           <FormControl>
//                             <Textarea placeholder="Enter description" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="rating"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Rating</FormLabel>
//                           <Select onValueChange={field.onChange} value={field.value.toString()}>
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select a rating" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {Array.from({ length: 5 }).map((_, index) => (
//                                 <SelectItem key={index} value={(index + 1).toString()}>
//                                   <div className="flex items-center gap-1">
//                                     {index + 1} <StarIcon className="h-4 w-4" />
//                                   </div>
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>

//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>

//                 <DialogFooter>
//                   <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
//                     {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
//                   </Button>
//                 </DialogFooter>
//               </form>
//             </Form>
//           </DialogContent>
//         </Dialog>
//       ) : (
//         <div>
//           Please
//           <Link className="px-2 text-primary" href={`/api/auth/signin?callbackUrl=/product/${productSlug}`}>
//             sign in
//           </Link>
//           to write a review
//         </div>
//       )}
//       <div className="flex flex-col gap-3">
//         {reviews.map((review) => (
//           <Card key={review.id}>
//             <CardHeader>
//               <div className="flex-between">
//                 <CardTitle>{review.title}</CardTitle>
//                 <div className="flex text-sm italic">
//                   <Check className="h-4 w-4" /> Verified Purchase
//                 </div>
//               </div>
//               <CardDescription>{review.description}</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row">
//                 <Rating value={review.rating} />
//                 <div className="flex items-center">
//                   <User className="mr-1 h-3 w-3" />
//                   {review.user ? review.user.name : 'Deleted User'}
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="mr-1 h-3 w-3" />
//                   {formatDateTime(review.createdAt).dateOnly}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//         <div ref={ref}>{page < totalPages && 'Loading...'}</div>
//       </div>
//     </div>
//   );
// }
