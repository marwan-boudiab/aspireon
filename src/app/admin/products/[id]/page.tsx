import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductForm from '@/components/shared/admin/product-form';
import { getProductById, getPromotionByProductId } from '@/lib/actions/product.actions';
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = { title: `Update product - ${APP_NAME}` };

export default async function UpdateProductPage({ params: { id } }: { params: { id: string } }) {
  // FUNCTION TO FETH PRODUCT AND ITS PROMOTION
  const getProductData = async () => {
    if (id) {
      const product = await getProductById(id);
      const promotion = await getPromotionByProductId(id);
      return { product, promotion };
    }
    return { product: undefined, promotion: undefined };
  };

  // GET PRODUCT AND ITS PROMOTION
  const { product, promotion } = await getProductData();

  if (!product) notFound();
  return (
    <div className="mx-auto space-y-8">
      <h1 className="h2-bold">Update Product</h1>
      <ProductForm type="Update" product={product} promotion={promotion} />
    </div>
  );
}
