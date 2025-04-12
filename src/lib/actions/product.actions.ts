'use server';

import { desc } from 'drizzle-orm';

import db from '@/db/drizzle';
import { products, promotions } from '@/db/schema';
import { and, count, eq, ilike, sql, asc, gt } from 'drizzle-orm/sql';
import { PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { insertProductSchema, updateProductSchema } from '../validator';
import { deleteImageFromUploadthing, formatError } from '../utils';

// CREATE
// export async function createProduct(data: z.infer<typeof insertProductSchema>) {
//   try {
//     const product = insertProductSchema.parse(data);
//     await db.insert(products).values(product);

//     revalidatePath('/admin/products');
//     return {
//       success: true,
//       message: 'Product created successfully',
//     };
//   } catch (error) {
//     return { success: false, message: formatError(error) };
//   }
// }
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const { hasPromotion, promotionData, ...productData } = insertProductSchema.parse(data);

    const [product] = await db.insert(products).values(productData).returning();

    if (hasPromotion && promotionData && promotionData.description && promotionData.startDate && promotionData.endDate) {
      await db.insert(promotions).values({
        productId: product.id,
        description: promotionData.description,
        startDate: promotionData.startDate,
        endDate: promotionData.endDate,
        isActive: true,
      });
    }

    revalidatePath('/admin/products');
    return {
      success: true,
      message: 'Product created successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// UPDATE
// export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
//   try {
//     const product = updateProductSchema.parse(data);
//     const productExists = await db.query.products.findFirst({
//       where: eq(products.id, product.id),
//     });
//     if (!productExists) throw new Error('Product not found');
//     await db.update(products).set(product).where(eq(products.id, product.id));
//     revalidatePath('/admin/products');
//     return {
//       success: true,
//       message: 'Product updated successfully',
//     };
//   } catch (error) {
//     return { success: false, message: formatError(error) };
//   }
// }
// export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
//   try {
//     const product = updateProductSchema.parse(data);

//     // Ensure product.id is not undefined
//     if (!product.id) {
//       throw new Error('Product ID is required');
//     }

//     const productExists = await db.query.products.findFirst({
//       where: eq(products.id, product.id),
//     });

//     if (!productExists) throw new Error('Product not found');

//     await db.update(products).set(product).where(eq(products.id, product.id));
//     revalidatePath('/admin/products');

//     return {
//       success: true,
//       message: 'Product updated successfully',
//     };
//   } catch (error) {
//     return { success: false, message: formatError(error) };
//   }
// }
// export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
//   try {
//     const { hasPromotion, promotionData, ...productData } = updateProductSchema.parse(data);

//     // Ensure product.id is not undefined
//     if (!productData.id) {
//       throw new Error('Product ID is required');
//     }

//     const productExists = await db.query.products.findFirst({
//       where: eq(products.id, productData.id),
//     });

//     if (!productExists) throw new Error('Product not found');

//     const [product] = await db.update(products).set(productData).where(eq(products.id, productData.id)).returning();
//     // console.log(hasPromotion, promotionData, productData);
//     if (hasPromotion && promotionData && promotionData.description && promotionData.startDate && promotionData.endDate) {
//       await db.insert(promotions).values({
//         productId: product.id,
//         description: promotionData.description,
//         startDate: promotionData.startDate,
//         endDate: promotionData.endDate,
//         isActive: true,
//       });
//     } else {
//       // IF HASPROMOTION IS FALSE, SET ISACTIVE TO FALSE FOR THE PRODUCT'S PROMOTION
//       await db.update(promotions).set({ isActive: false }).where(eq(promotions.productId, productData.id));
//     }
//     revalidatePath('/admin/products');

//     return {
//       success: true,
//       message: 'Product updated successfully',
//     };
//   } catch (error) {
//     return { success: false, message: formatError(error) };
//   }
// }

export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const { hasPromotion, promotionData, ...productData } = updateProductSchema.parse(data);

    // ENSURE PRODUCT ID IS NOT UNDEFINED
    if (!productData.id) throw new Error('Product ID is required');

    const productExists = await db.query.products.findFirst({
      where: eq(products.id, productData.id),
    });

    if (!productExists) throw new Error('Product not found');

    const [product] = await db.update(products).set(productData).where(eq(products.id, productData.id)).returning();

    if (hasPromotion && promotionData && promotionData.description && promotionData.startDate && promotionData.endDate) {
      // CHECK IF THE PRODUCT ALREADY HAS A PROMOTION
      const existingPromotion = await db.query.promotions.findFirst({
        where: eq(promotions.productId, productData.id),
      });

      if (existingPromotion) {
        // UPDATE THE EXISTING PROMOTION
        await db
          .update(promotions)
          .set({
            description: promotionData.description,
            startDate: promotionData.startDate,
            endDate: promotionData.endDate,
            isActive: true,
          })
          .where(eq(promotions.productId, productData.id));
      } else {
        // IF THE PRODUCT DOESN'T HAVE A PROMOTION, CREATE A NEW ONE
        await db.insert(promotions).values({
          productId: product.id,
          description: promotionData.description,
          startDate: promotionData.startDate,
          endDate: promotionData.endDate,
          isActive: true,
        });
      }
    } else {
      // IF HASPROMOTION IS FALSE, DEACTIVATE ANY EXISTING PROMOTION FOR THE PRODUCT
      await db.update(promotions).set({ isActive: false }).where(eq(promotions.productId, productData.id));
    }

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// GET
export async function getProductById(productId: string) {
  return await db.query.products.findFirst({
    where: eq(products.id, productId),
  });
}

export async function getLatestProducts() {
  try {
    const data = await db.query.products.findMany({
      where: gt(products.stock, 0),
      orderBy: [desc(products.createdAt)],
      limit: 4,
    });

    return data;
  } catch (error) {
    console.error('Failed to fetch latest products:', error);
    throw new Error('Failed to fetch latest products');
  }
}

// ON SALE
export async function getOnSaleProducts() {
  try {
    const data = await db.query.products.findMany({
      where: gt(products.salePercentage, 0),
      orderBy: [desc(products.salePercentage)],
      limit: 4,
    });

    return data;
  } catch (error) {
    console.error('Failed to fetch latest products:', error);
    throw new Error('Failed to fetch latest products');
  }
}

export const getPromotionByProductId = async (productId: string) => {
  try {
    const promotion = await db
      .select()
      .from(promotions)
      // .where(and(eq(promotions.productId, productId), eq(promotions.isActive, true)))
      .where(and(eq(promotions.productId, productId)))
      .limit(1);

    return promotion[0] || null;
  } catch (error) {
    console.error('Error fetching promotion:', error);
    throw new Error('Failed to fetch promotion');
  }
};

// Function to get the closest promoted product
export async function getClosestPromotedProduct() {
  // Fetch the promotion with the closest endDate, if there are multiple active promotions
  const closestPromotion = await db
    .select()
    .from(promotions)
    .where(eq(promotions.isActive, true)) // Use eq for equality check
    .orderBy(asc(promotions.endDate)) // Use asc for ordering
    .limit(1) // Get only one promotion
    .execute();

  if (!closestPromotion.length) {
    return null; // No active promotion found
  }

  // Get the product associated with the promotion
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, closestPromotion[0].productId)) // eq for the product ID condition
    .execute();

  return {
    product: product[0], // Return the product data
    promotion: closestPromotion[0], // Return the promotion data
  };
}

export async function getProductBySlug(slug: string) {
  return await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });
}

export async function getAllProducts({ query, limit = PAGE_SIZE, page, category, price, rating, sort }: { query: string; category: string; limit?: number; page: number; price?: string; rating?: string; sort?: string }) {
  try {
    // Create a SQL expression for discounted price calculation
    // Cast to decimal and ensure proper decimal division
    const discountedPrice = sql`${products.price} * (1 - CAST(${products.salePercentage} AS DECIMAL(10,2)) / 100.0)`;

    const queryFilter = query && query !== 'all' ? ilike(products.name, `%${query}%`) : undefined;
    const categoryFilter = category && category !== 'all' ? eq(products.category, category) : undefined;
    const ratingFilter = rating && rating !== 'all' ? sql`${products.rating} >= ${rating}` : undefined;
    // 100-200
    // const priceFilter = price && price !== 'all' ? sql`${products.price} >= ${price.split('-')[0]} AND ${products.price} <= ${price.split('-')[1]}` : undefined;
    // Price filter with applied sale percentage
    // const priceFilter =
    //   price && price !== 'all'
    //     ? sql`(${products.price} * (1 - ${products.salePercentage} / 100)) >= ${price.split('-')[0]}
    //    AND (${products.price} * (1 - ${products.salePercentage} / 100)) <= ${price.split('-')[1]}`
    //     : undefined;
    const priceFilter =
      price && price !== 'all'
        ? sql`${discountedPrice} >= ${price.split('-')[0]} 
           AND ${discountedPrice} <= ${price.split('-')[1]}`
        : undefined;

    // Sorting logic based on 'sort' query
    // const order = sort === 'lowest' ? products.price : sort === 'highest' ? desc(products.price) : sort === 'rating' ? desc(products.rating) : desc(products.createdAt);
    const order = sort === 'lowest' ? asc(discountedPrice) : sort === 'highest' ? desc(discountedPrice) : sort === 'rating' ? desc(products.rating) : desc(products.createdAt);

    // Combining all the filters into one condition
    const condition = and(queryFilter, categoryFilter, ratingFilter, priceFilter);

    // Query to get product data with pagination
    const data = await db
      .select()
      .from(products)
      .where(condition)
      .orderBy(order)
      .offset((page - 1) * limit)
      .limit(limit);

    // Query to count total products matching the filters for pagination
    const dataCount = await db.select({ count: count() }).from(products).where(condition);

    // Returning the result with paginated data and total pages
    return { data, totalPages: Math.ceil(dataCount[0].count / limit) };
  } catch (error) {
    // Logging the error for debugging purposes
    console.error('Error fetching products:', error);

    // Returning an appropriate error response
    throw new Error('An error occurred while fetching products. Please try again later.');
  }
}

export async function getAllCategories() {
  const data = await db.selectDistinctOn([products.category], { name: products.category }).from(products).orderBy(products.category);
  return data;
}

export async function getFeaturedProducts() {
  const data = await db.query.products.findMany({
    where: eq(products.isFeatured, true),
    orderBy: [desc(products.createdAt)],
    limit: 4,
  });
  return data;
}
// DELETE
// export async function deleteProduct(id: string) {
//   try {
//     const productExists = await db.query.products.findFirst({
//       where: eq(products.id, id),
//     });
//     if (!productExists) throw new Error('Product not found');
//     await db.delete(products).where(eq(products.id, id));
//     revalidatePath('/admin/products');
//     return {
//       success: true,
//       message: 'Product deleted successfully',
//     };
//   } catch (error) {
//     return { success: false, message: formatError(error) };
//   }
// }

export async function deleteProduct(id: string) {
  try {
    const productExists = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!productExists) throw new Error('Product not found');

    // Delete banner image if it exists
    if (productExists.banner) {
      const result = await deleteImageFromUploadthing(productExists.banner);
      if (!result.success) throw new Error(result.message);
    }

    // Delete each image associated with the product
    for (const image of productExists.images) {
      const result = await deleteImageFromUploadthing(image);
      if (!result.success) throw new Error(result.message);
    }

    // Delete the product itself
    await db.delete(products).where(eq(products.id, id));

    revalidatePath('/admin/products');

    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
