import * as z from 'zod';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { formatNumberWithDecimal } from './utils';
import { PAYMENT_METHODS } from './constants';
import { orders, products, reviews } from '@/db/schema';

// const phoneValidation = new RegExp(/^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/);
const phoneValidation = new RegExp(/^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:0|9\d|[2-9])\d{3})\-?(\d{4}))$/);

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name cannot exceed 100 characters')
  .regex(/^[a-zA-Z\s-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .trim();

export const emailSchema = z.string().email('Invalid email address').min(3, 'Email must be at least 3 characters').max(254, 'Email cannot exceed 254 characters').trim();
export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password cannot exceed 128 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{12,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
export const confirmPasswordSchema = z.string().min(12, 'Confirm password must be at least 12 characters');

export const passwordSignInSchema = z.string().min(1, 'Password is required');
// USER
export const signInMagicSchema = z.object({ email: emailSchema });
export const signInFormSchema = z.object({ email: emailSchema, password: passwordSignInSchema });
export const signUpFormSchema = z.object({ name: nameSchema, email: emailSchema, password: passwordSchema, confirmPassword: confirmPasswordSchema }).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const updateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email().min(3, 'Email must be at least 3 characters'),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || phoneValidation.test(value), {
      message: 'Invalid phone',
    }),
  // .regex(phoneValidation, { message: 'invalid phone' }).optional(),
});

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, 'Id is required'),
  role: z.string().min(1, 'Role is required'),
});

const productValidations = {
  name: z.string().min(1, 'Name cannot be empty'),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe (lowercase letters, numbers, and hyphens)')
    .min(1, 'Slug cannot be empty'),
  category: z.string().min(1, 'Category cannot be empty'),
  images: z.array(z.string().url('Each image must be a valid URL')).min(1, 'Product must have at least one image'),
  sizes: z.array(z.string()).min(1, 'Product must have at least one size'),
  brand: z.string().min(1, 'Brand cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  stock: z.coerce.number().min(0, 'Stock must be at least 0'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number with up to two decimal places'),
  salePercentage: z.coerce.number().min(0, 'Sales percentage must be at least 0').max(100, 'Sales percentage cannot exceed 100'),
  isFeatured: z.boolean().optional().default(false),
  banner: z.string().optional().nullable(),
};

const promotionSchema = z.object({
  description: z.string().optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
});

export const insertProductSchema = createSelectSchema(products, productValidations)
  .omit({
    id: true,
    rating: true,
    numReviews: true,
    createdAt: true,
  })
  .extend({
    hasPromotion: z.boolean().optional().default(false),
    promotionData: promotionSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.isFeatured && !data.banner) {
        return false;
      }
      return true;
    },
    {
      message: 'A banner image must be provided when the product is featured.',
      path: ['banner'],
    },
  )
  .refine(
    (data) => {
      if (data.hasPromotion && data.promotionData) {
        const { description } = data.promotionData;
        return !!description;
      }
      return true;
    },
    {
      message: 'Description is required when promotion is enabled.',
      path: ['promotionData.description'],
    },
  )
  .refine(
    (data) => {
      if (data.hasPromotion && data.promotionData) {
        const { startDate } = data.promotionData;
        return !!startDate;
      }
      return true;
    },
    {
      message: 'Start date is required when promotion is enabled.',
      path: ['promotionData.startDate'],
    },
  )
  .refine(
    (data) => {
      if (data.hasPromotion && data.promotionData) {
        const { endDate } = data.promotionData;
        return !!endDate;
      }
      return true;
    },
    {
      message: 'End date is required when promotion is enabled.',
      path: ['promotionData.endDate'],
    },
  )
  .refine(
    (data) => {
      if (data.hasPromotion && data.promotionData) {
        const { startDate, endDate } = data.promotionData;
        return startDate && endDate && startDate < endDate;
      }
      return true;
    },
    {
      message: 'End date must be after the start date.',
      path: ['promotionData.endDate'],
    },
  );
export const updateProductSchema = createSelectSchema(products, productValidations)
  .omit({
    rating: true,
    numReviews: true,
    createdAt: true,
  })
  .extend({
    hasPromotion: z.boolean().optional().default(false),
    promotionData: promotionSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.isFeatured && !data.banner) {
        return false;
      }
      return true;
    },
    {
      message: 'A banner image must be provided when the product is featured.',
      path: ['banner'],
    },
  )
  .refine(
    (data) => {
      if (data.hasPromotion && data.promotionData) {
        const { description } = data.promotionData;
        return !!description;
      }
      return true;
    },
    {
      message: 'Description is required when promotion is enabled.',
      path: ['promotionData.description'],
    },
  )
  .refine(
    (data) => {
      if (data.hasPromotion && data.promotionData) {
        const { startDate } = data.promotionData;
        return !!startDate;
      }
      return true;
    },
    {
      message: 'Start date is required when promotion is enabled.',
      path: ['promotionData.startDate'],
    },
  )
  .refine(
    (data) => {
      if (data.hasPromotion && data.promotionData) {
        const { endDate } = data.promotionData;
        return !!endDate;
      }
      return true;
    },
    {
      message: 'End date is required when promotion is enabled.',
      path: ['promotionData.endDate'],
    },
  )
  .refine(
    (data) => {
      if (data.hasPromotion && data.promotionData) {
        const { startDate, endDate } = data.promotionData;
        return startDate && endDate && startDate < endDate;
      }
      return true;
    },
    {
      message: 'End date must be after the start date.',
      path: ['promotionData.endDate'],
    },
  );

export const insertReviewSchema = createInsertSchema(reviews, {
  rating: z.coerce.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
});

// Cart
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  qty: z.number().int().nonnegative('Quantity must be a non-negative number'),

  image: z.string().min(1, 'Image is required'),
  price: z.number().refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)), 'Price must have exactly two decimal places (e.g., 49.99)'),
  size: z.string().optional(),
});

// Address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
  city: z.string().min(3, 'city must be at least 3 characters'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  country: z.string().min(3, 'Country must be at least 3 characters'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const paymentMethodSchema = z.object({ type: z.string().min(1, 'Payment method is required') }).refine((data) => PAYMENT_METHODS.includes(data.type), {
  path: ['type'],
  message: 'Invalid payment method',
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

export const insertOrderSchema = createInsertSchema(orders, {
  shippingAddress: shippingAddressSchema,
  paymentResult: z
    .object({
      id: z.string(),
      status: z.string(),
      email_address: z.string(),
      pricePaid: z.string(),
    })
    .optional(),
});
