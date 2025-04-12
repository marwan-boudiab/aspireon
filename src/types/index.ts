import { carts, orderItems, orders, products, promotions, reviews } from '@/db/schema';
import { cartItemSchema, paymentResultSchema, shippingAddressSchema } from '@/lib/validator';
import { InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';

// PRODUCTS
export type Product = InferSelectModel<typeof products>;

// PROMOTIONS
export type Promotion = InferSelectModel<typeof promotions>;

// REVIEWS
export type Review = InferSelectModel<typeof reviews> & {
  user?: { name: string };
};

// CART
export type Cart = InferSelectModel<typeof carts>;
export type CartItem = z.infer<typeof cartItemSchema>;

// SHIPPING
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

// PAYMENT
export type PaymentResult = z.infer<typeof paymentResultSchema>;

// ORDERS
export type Order = InferSelectModel<typeof orders> & {
  orderItems: OrderItem[];
  user: { name: string | null; email: string };
};
export type OrderItem = InferSelectModel<typeof orderItems>;

// ADMIN PRODUCT FORM
export interface BaseProductFormData {
  name: string;
  slug: string;
  category: string;
  images: string[];
  sizes: string[];
  brand: string;
  description: string;
  stock: number;
  price: string;
  salePercentage: number;
  rating: string;
  numReviews: number;
  isFeatured: boolean;
  banner: string | null;
  hasPromotion: boolean;
  promotionData?: {
    description: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
}

// CREATE PRODUCT
export type CreateProductFormData = BaseProductFormData;

// UPDATE PRODUCT
export interface UpdateProductFormData extends BaseProductFormData {
  id: string;
  createdAt: Date;
}

// UNION TYPE FOR FORM DATA
export type ProductFormData = CreateProductFormData | UpdateProductFormData;
