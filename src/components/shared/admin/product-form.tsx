/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import slugify from 'slugify';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { productDefaultValues } from '@/lib/constants';
import { insertProductSchema, updateProductSchema } from '@/lib/validator';
import { Product, ProductFormData, Promotion, UpdateProductFormData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DatePicker } from '@/components/ui/date-picker';

const generateSlug = (name: string) => {
  const slug = slugify(name, {
    lower: true, // Convert to lowercase
    strict: true, // Remove special characters
    // remove: /[^a-z0-9 -]/g, // Allow only lowercase letters, numbers, spaces, and hyphens
  });

  // Replace spaces with hyphens, ensure no leading/trailing/multiple hyphens
  return slug
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
    .replace(/--+/g, '-'); // Collapse multiple hyphens
};

export default function ProductForm({ type, product, promotion }: { type: 'Create' | 'Update'; product?: Product; promotion?: Promotion }) {
  const router = useRouter();
  const { toast } = useToast();
  // Add this state at the top of ProductForm component with other state declarations:
  const [sizeInput, setSizeInput] = useState('');
  // GET DEFAULT VALUES FOR THE FORM FIELDS BASED ON THE TYPE AND PRODUCT
  const getDefaultValues = () => {
    if (product && type === 'Update') {
      return {
        ...product, // This includes id and createdAt
        hasPromotion: promotion?.isActive,
        promotionData: promotion
          ? {
              description: promotion.description,
              startDate: new Date(promotion.startDate),
              endDate: new Date(promotion.endDate),
              isActive: promotion.isActive,
            }
          : undefined,
      } as UpdateProductFormData;
    }

    return productDefaultValues;
  };

  // USEFORM HOOK FOR THE FORM VALIDATION AND SUBMISSION
  const form = useForm<ProductFormData>({
    resolver: zodResolver(type === 'Update' ? updateProductSchema : insertProductSchema),
    defaultValues: getDefaultValues(),
  });

  // STATE FOR THE BANNER IMAGE AND UPLOADED IMAGES
  const [isUploading, setIsUploading] = useState(false);

  // REFS FOR THE UPLOADED AND REMOVED IMAGES WE USE REF INSTEAD OF STATE FOR PERSISTENT OF THE IMAGES BETWEEN RERENDERS
  const uploadedImagesRef = useRef<string[]>([]);
  const removedImagesRef = useRef<string[]>([]);

  useEffect(() => {
    const handleUnload = async () => {
      if (!form.formState.isSubmitting) {
        // Delete unconfirmed uploaded images
        for (const image of uploadedImagesRef.current) {
          await fetch('/api/uploadthing', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: image }) });
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      handleUnload(); // Clean up on unmount
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [form.formState.isSubmitting]);

  // FUNCTION TO HANDLE THE FORM SUBMISSION
  async function onSubmit(values: z.infer<typeof insertProductSchema>) {
    // console.log('Form Submitted with values:', values); // Log submitted values

    // IF THERE IS NO BANNER IMAGE, SET ISFEATURED TO FALSE
    if (!banner) form.setValue('isFeatured', false);
    if (!promotionData) form.setValue('hasPromotion', false);

    // CREATE OR UPDATE THE PRODUCT BASED ON THE TYPE
    let res;
    if (type === 'Create') res = await createProduct(values);
    else if (type === 'Update' && product && product.id) res = await updateProduct({ ...values, id: product.id });

    // HANDLE THE RESPONSE
    if (res?.success) {
      // DELETE IMAGES MARKED FOR REMOVAL
      for (const image of removedImagesRef.current) {
        const response = await fetch('/api/uploadthing', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: image }) });
        if (!response.ok) throw new Error('Failed to delete image.');
      }

      // CLEAR THE UPLOADEDIMAGES STATE ON SUCCESSFUL SUBMISSION
      uploadedImagesRef.current = [];

      // TOAST SUCCESS MESSAGE
      toast({ title: 'Success', description: res.message });

      // REDIRECT TO THE PRODUCTS PAGE
      router.push(`/admin/products`);
    } else {
      console.log(res);
      // TOAST ERROR MESSAGE
      toast({ title: 'Error', variant: 'destructive', description: res?.message || 'An error occurred.' });
    }
  }

  // FUNCTION TO MARK AN IMAGE FOR REMOVAL
  const handleRemoveImage = (image: string) => {
    // ADD THE IMAGE TO THE LIST OF IMAGES MARKED FOR REMOVAL
    removedImagesRef.current.push(image);

    // REMOVE THE IMAGE FROM THE LIST OF UPLOADED IMAGES
    form.setValue(
      'images',
      form.getValues('images').filter((img) => img !== image),
    );

    // TOAST SUCCESS MESSAGE TO INDICATE THE IMAGE HAS BEEN MARKED FOR REMOVAL
    toast({ description: 'Image marked for removal' });
  };

  // FUNCTION TO MARK A BANNER IMAGE FOR REMOVAL
  const handleRemoveBanner = (image: string | null | undefined) => {
    try {
      // THROW AN ERROR IF NO IMAGE IS PROVIDED
      if (!image) throw new Error('No image provided for removal.');

      // ADD THE IMAGE TO THE LIST OF IMAGES MARKED FOR REMOVAL
      removedImagesRef.current.push(image);

      // CLEAR THE BANNER VALUE IN THE FORM
      form.setValue('banner', null);

      // REMOVE THE VALIDATION FOR THE BANNER FIELD AND ISFEATURED FIELD
      form.clearErrors(['banner', 'isFeatured']);

      // TOAST SUCCESS MESSAGE TO INDICATE THE IMAGE HAS BEEN MARKED FOR REMOVAL
      toast({ description: 'Banner marked for removal' });
    } catch (error) {
      // LOG THE ERROR
      console.error('Failed to remove banner:', error);

      // TOAST ERROR MESSAGE TO INDICATE THE IMAGE HAS NOT BEEN MARKED FOR REMOVAL
      toast({ title: 'Error', variant: 'destructive', description: 'An error occurred while removing the image.' });
    }
  };

  // GET THE VALUES OF THE FORM FIELDS
  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const hasPromotion = form.watch('hasPromotion');
  const banner = form.watch('banner');
  const promotionData = form.watch('promotionData');

  return (
    <Form {...form}>
      <form method="post" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>

                <FormControl>
                  <div className="relative flex gap-2">
                    <Input placeholder="Enter product slug" className="pl-8" {...field} />
                    <Button
                      type="button"
                      onClick={() => {
                        form.setValue('slug', generateSlug(form.getValues('name')));
                        form.clearErrors('slug');
                        toast({ title: 'Success', description: 'Slug generated successfully' });
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salePercentage"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Sale Percentage</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter product sale percentage" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter product stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="sizes"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Sizes</FormLabel>
                <div className="space-y-4">
                  <div className="relative flex gap-2">
                    <Input placeholder="Enter size" value={sizeInput} onChange={(e) => setSizeInput(e.target.value.toUpperCase())} />
                    <Button
                      type="button"
                      disabled={!sizeInput}
                      onClick={() => {
                        const newSizes = [...field.value, sizeInput];
                        field.onChange(newSizes);
                        setSizeInput('');
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((size: string, index: number) => (
                      <div key={`${size}-${index}`} className="relative inline-block">
                        <div className="rounded-full border-2 bg-primary px-3 py-1 text-white">
                          {size}
                          <X
                            className="absolute -right-1 -top-1 h-4 w-4 cursor-pointer rounded-full border-2 bg-destructive hover:bg-destructive/50"
                            onClick={() => {
                              const newSizes = field.value.filter((_, i) => i !== index);
                              field.onChange(newSizes);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter product description" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="hasPromotion"
            render={({ field }) => (
              <FormItem className="my-4 items-center space-x-2">
                <div className="flex items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => {
                        // When isFeatured is set to false, clear the banner and isFeatured errors
                        if (value === false) form.clearErrors(['hasPromotion', 'promotionData', 'promotionData.description', 'promotionData.startDate', 'promotionData.endDate']);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormLabel>Add Promotion</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {hasPromotion && (
            <div>
              <FormField
                control={form.control}
                name="promotionData.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotion Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter promotion description" className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-3 flex flex-col gap-5 md:flex-row">
                <FormField
                  control={form.control}
                  name="promotionData.startDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="flex items-center">
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <DatePicker date={field.value} onChange={field.onChange} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="promotionData.endDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="flex items-center">
                        <FormLabel>End Date&nbsp;&nbsp;</FormLabel>
                        <FormControl>
                          <DatePicker date={field.value} onChange={field.onChange} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="mb-3">Product Images</CardTitle>
                    <FormControl>
                      <UploadButton
                        disabled={isUploading}
                        onUploadBegin={() => setIsUploading(true)} // Mark upload as in progress
                        content={{
                          allowedContent({ ready, isUploading }) {
                            if (!ready) return 'Please wait';
                            if (isUploading) return 'Seems like stuff is uploading';
                            return `Max file size: 4MB`;
                          },
                        }}
                        appearance={{
                          button({ ready, isUploading }) {
                            return `custom-button ${ready ? 'custom-button-ready' : 'custom-button-not-ready'} ${isUploading ? 'custom-button-uploading' : ''}`;
                          },
                          container: 'custom-container',
                          allowedContent: 'custom-allowed-content',
                        }}
                        endpoint="imageUploader"
                        // onClientUploadComplete={(res: any) => {
                        //   form.setValue('images', [...images, res[0].url]);
                        // }}
                        onClientUploadComplete={(res) => {
                          const imageUrl = res[0].url;
                          form.setValue('images', [...form.getValues('images'), imageUrl]);
                          uploadedImagesRef.current.push(imageUrl);
                          // console.log('Upload completed:', res);
                          form.clearErrors('images');
                          toast({ title: 'Success', description: 'Image uploaded successfully!' });
                          setIsUploading(false);
                        }}
                        onUploadError={(error: Error) => {
                          // console.error('Upload error:', error);
                          toast({
                            title: 'Error uploading product image',
                            variant: 'destructive',
                            description: `ERROR! ${error.message}`,
                          });
                          setIsUploading(false);
                        }}
                      />
                    </FormControl>
                  </CardHeader>
                  <CardContent className="space-y-2 p-3">
                    <div className="flex-start space-x-2">
                      {images.map((image: string) => (
                        <div key={image} className="relative">
                          <Image src={image} alt="product image" className="h-20 w-20 rounded-lg object-cover object-center" width={100} height={100} />
                          <X className="absolute right-[2pt] top-[2pt] h-5 w-5 cursor-pointer rounded-full border-2 bg-destructive hover:bg-destructive/50" onClick={() => handleRemoveImage(image)} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* <div>
          <Card>
            <CardHeader>Featured Product</CardHeader>
            <CardContent className="my-2 space-y-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="items-center space-x-2">
                    <div className="flex items-center">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Is Featured?</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <div className="relative">
                  <Image src={banner} alt="banner image" className="w-full rounded-lg object-cover object-center" width={1920} height={680} />
                  <X className="absolute right-[4pt] top-[4pt] h-5 w-5 cursor-pointer rounded-full bg-destructive" onClick={() => handleRemoveBanner(banner)} />
                </div>
              )}
              {isFeatured && !banner && (
                <UploadButton
                  appearance={{
                    button({ ready, isUploading }) {
                      return `custom-button ${ready ? 'custom-button-ready' : 'custom-button-not-ready'} ${isUploading ? 'custom-button-uploading' : ''}`;
                    },
                    container: 'custom-container',
                    allowedContent: 'custom-allowed-content',
                  }}
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const imageUrl = res[0].url;
                    form.setValue('banner', imageUrl);
                    uploadedImagesRef.current.push(imageUrl);
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      variant: 'destructive',
                      description: `ERROR! ${error.message}`,
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div> */}
        {/* <div>
          <Card>
            <CardHeader>Promotion Details</CardHeader>
            <CardContent className="my-2 space-y-4">
              <FormField
                control={form.control}
                name="hasPromotion"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={hasPromotion} onCheckedChange={(checked) => setHasPromotion(checked as boolean)} />
                    </FormControl>
                    <FormLabel>Add Promotion</FormLabel>
                  </FormItem>
                )}
              />

              {hasPromotion && (
                <>
                  <FormField
                    control={form.control}
                    name="promotionData.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promotion Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter promotion details" className="resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="promotionData.dateRange"
                    render={() => (
                      <FormItem>
                        <FormLabel>Promotion Period</FormLabel>
                        <FormControl>
                          <DatePickerWithRange className="w-full" date={dateRange} onSelect={handleDateRangeChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div> */}

        <div>
          <Card>
            <CardHeader className="p-3">
              <CardTitle>Featured Product</CardTitle>
            </CardHeader>
            <CardContent className="my-2 space-y-2 p-3">
              {/* Is Featured Field */}
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="items-center space-x-2">
                    <div className="mb-3 flex items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(value) => {
                            // When isFeatured is set to false, clear the banner and isFeatured errors
                            if (value === false) form.clearErrors('banner');
                            field.onChange(value); // Update the isFeatured field value
                          }}
                        />
                      </FormControl>
                      <FormLabel>Is Featured?</FormLabel>
                    </div>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              {/* Banner Upload Section */}
              {isFeatured && (
                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field }) => (
                    <FormItem>
                      {/* Validation Error Message */}
                      <FormMessage />
                      {field.value ? (
                        /* Display Uploaded Banner */
                        <div className="relative">
                          <Image src={field.value} alt="Banner image" className="w-full rounded-lg object-cover object-center" width={1920} height={680} />
                          <X
                            className="absolute right-[4pt] top-[4pt] h-5 w-5 cursor-pointer rounded-full bg-destructive"
                            onClick={() => {
                              handleRemoveBanner(field.value); // Custom handler to manage banner removal
                              field.onChange(''); // Clear the banner field in the form
                            }}
                          />
                        </div>
                      ) : (
                        /* Upload Banner Button */
                        <UploadButton
                          onUploadBegin={() => setIsUploading(true)}
                          appearance={{
                            button({ ready, isUploading }) {
                              return `custom-button ${ready ? 'custom-button-ready' : 'custom-button-not-ready'} ${isUploading ? 'custom-button-uploading' : ''}`;
                            },
                            container: 'custom-container',
                            allowedContent: 'custom-allowed-content',
                          }}
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            const imageUrl = res[0].url;
                            field.onChange(imageUrl); // Update banner in form
                            uploadedImagesRef.current.push(imageUrl);
                            setIsUploading(false);
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              title: 'Error uploading product banner',
                              variant: 'destructive',
                              description: `ERROR! ${error.message}`,
                            });
                            setIsUploading(false);
                          }}
                        />
                      )}
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Button type="submit" size="lg" disabled={form.formState.isSubmitting || isUploading} className="button col-span-2 w-full">
            {form.formState.isSubmitting ? 'Submitting...' : `${type} Product `}
          </Button>
        </div>
      </form>
    </Form>
  );
}
