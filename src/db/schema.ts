import { CartItem, PaymentResult, ShippingAddress } from '@/types';
import { relations } from 'drizzle-orm';
import { integer, json, pgTable, text, timestamp, uniqueIndex, uuid, numeric, boolean } from 'drizzle-orm/pg-core';
import { primaryKey } from 'drizzle-orm/pg-core/primary-keys';
import { AdapterAccountType } from 'next-auth/adapters';

// USERS

export const users = pgTable(
  'user',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: text('name').notNull().default('NO_NAME'),
    email: text('email').notNull(),
    role: text('role').notNull().default('user'),
    password: text('password'),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image'),
    phone: text('phone'),
    address: json('address').$type<ShippingAddress>(),
    paymentMethod: text('paymentMethod'),
    createdAt: timestamp('createdAt').defaultNow(),
  },
  (table) => {
    return {
      // unique index to make queries faster
      userEmailIdx: uniqueIndex('user_email_idx').on(table.email),
    };
  },
);

export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// PRODUCTS
export const products = pgTable(
  'product',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    category: text('category').notNull(),
    images: text('images').array().notNull(),
    sizes: text('sizes').array().notNull(),
    brand: text('brand').notNull(),
    description: text('description').notNull(),
    stock: integer('stock').notNull(),
    price: numeric('price', { precision: 12, scale: 2 }).notNull().default('0'),
    salePercentage: integer('sale_percentage').notNull().default(0),
    rating: numeric('rating', { precision: 3, scale: 2 }).notNull().default('0'),
    numReviews: integer('numReviews').notNull().default(0),
    isFeatured: boolean('isFeatured').default(false).notNull(),
    banner: text('banner'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (table) => {
    return {
      productSlugIdx: uniqueIndex('product_slug_idx').on(table.slug),
    };
  },
);

// PROMOTIONS
export const promotions = pgTable('promotion', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  productId: uuid('productId')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  startDate: timestamp('startDate').notNull(),
  endDate: timestamp('endDate').notNull(),
  isActive: boolean('isActive').default(true).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

// REVIEWS
export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  productId: uuid('productId')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  title: text('title').notNull(),
  description: text('slug').notNull(),
  isVerifiedPurchase: boolean('isVerifiedPurchase').notNull().default(true),
  // isVerifiedPurchase: boolean('isVerifiedPurchase').notNull().$default(() => ....),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

// Update product relations to include promotions
export const productRelations = relations(products, ({ many }) => ({
  reviews: many(reviews),
  promotions: many(promotions),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

export const promotionRelations = relations(promotions, ({ one }) => ({
  product: one(products, {
    fields: [promotions.productId],
    references: [products.id],
  }),
}));

// CARTS
export const carts = pgTable('cart', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  userId: uuid('userId').references(() => users.id, {
    onDelete: 'cascade',
  }),
  sessionCartId: text('sessionCartId').notNull(),
  items: json('items').$type<CartItem[]>().notNull().default([]),
  itemsPrice: numeric('itemsPrice', { precision: 12, scale: 2 }).notNull(),
  shippingPrice: numeric('shippingPrice', {
    precision: 12,
    scale: 2,
  }).notNull(),
  taxPrice: numeric('taxPrice', { precision: 12, scale: 2 }).notNull(),
  totalPrice: numeric('totalPrice', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

// ORDERS
export const orders = pgTable('order', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  shippingAddress: json('shippingAddress').$type<ShippingAddress>().notNull(),
  paymentMethod: text('paymentMethod').notNull(),
  paymentResult: json('paymentResult').$type<PaymentResult>(),
  itemsPrice: numeric('itemsPrice', { precision: 12, scale: 2 }).notNull(),
  shippingPrice: numeric('shippingPrice', {
    precision: 12,
    scale: 2,
  }).notNull(),
  taxPrice: numeric('taxPrice', { precision: 12, scale: 2 }).notNull(),
  totalPrice: numeric('totalPrice', { precision: 12, scale: 2 }).notNull(),
  isPaid: boolean('isPaid').notNull().default(false),
  paidAt: timestamp('paidAt'),
  isDelivered: boolean('isDelivered').notNull().default(false),
  deliveredAt: timestamp('deliveredAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  orderItems: many(orderItems),
  user: one(users, { fields: [orders.userId], references: [users.id] }),
}));

export const orderItems = pgTable(
  'orderItems',
  {
    orderId: uuid('orderId')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: uuid('productId')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    qty: integer('qty').notNull(),
    price: numeric('price', { precision: 12, scale: 2 }).notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    image: text('image').notNull(),
    size: text('size').notNull().default('N/A'),
  },
  (orderItem) => ({
    compoundKey: primaryKey({
      columns: [orderItem.orderId, orderItem.productId, orderItem.size],
    }),
  }),
);

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
