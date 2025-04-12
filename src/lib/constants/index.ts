import { CreateProductFormData } from '@/types';

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Aspireon';
export const APP_TITLE = process.env.NEXT_PUBLIC_APP_TITLE || 'Discover the Best Products for Your Lifestyle';
export const APP_SUBTITLE = process.env.NEXT_PUBLIC_APP_SUBTITLE || 'Aspireon offers a curated selection of high-quality products to enhance your everyday life. Find the perfect items to suit your needs and style.';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'An Amazon clone built with Next.js, Postgres, Shadcn';

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 3;

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(', ') : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';

export const USER_ROLES = process.env.USER_ROLES ? process.env.USER_ROLES.split(', ') : ['admin', 'user'];

export const signInDefaultValues = { email: '', password: '' };
export const signUpDefaultValues = { name: '', email: '', password: '', confirmPassword: '' };
export const shippingAddressDefaultValues = { fullName: '', streetAddress: '', city: '', postalCode: '', country: '' };
export const productDefaultValues: CreateProductFormData = { name: '', slug: '', category: '', images: [], sizes: ['XXL', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'], brand: '', description: '', price: '0', salePercentage: 0, stock: 0, rating: '0', numReviews: 0, isFeatured: false, banner: null, hasPromotion: false, promotionData: { description: '', startDate: new Date(), endDate: new Date(), isActive: true } };
export const reviewFormDefaultValues = { title: '', comment: '', rating: 0 };

export const DEVELOPERS = process.env.DEVELOPERS || 'Aspire Solutions';
