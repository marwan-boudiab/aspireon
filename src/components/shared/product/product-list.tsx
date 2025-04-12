import { Product } from '@/types';
import ProductCard from './product-card';

const ProductList = ({ title, data }: { title: string; data: Product[] }) => {
  return (
    <div className="mt-10 md:mt-24">
      <h2 className="h2-bold mb-6 mt-10 text-center">{title}</h2>

      {data.length > 0 ? (
        <div className="grid grid-cols-2 justify-items-center gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>No product found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
