'use client';

import Rating from '@/components/shared/product/rating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface FilterSelectionsProps {
  q: string;
  categories: { name: string }[];
  currentCategory: string;
  currentPrice: string;
  currentRating: string;
  currentSort: string;
}

const ratings = [
  { name: 'Any', value: 'all' },
  { name: '4 stars & up', value: '4' },
  { name: '3 stars & up', value: '3' },
  { name: '2 stars & up', value: '2' },
  { name: '1 star & up', value: '1' },
];

const sortOrders: { name: string; value: string }[] = [
  { name: 'Newest', value: 'newest' },
  { name: 'Price: Low to High', value: 'lowest' },
  { name: 'Price: High to Low', value: 'highest' },
  { name: 'Rating', value: 'rating' },
];

export default function FilterSelections({ q, categories, currentCategory, currentPrice, currentRating, currentSort }: FilterSelectionsProps) {
  const router = useRouter();

  // Parse the initial min and max prices from currentPrice
  const [customMinPrice, setCustomMinPrice] = useState('');
  const [customMaxPrice, setCustomMaxPrice] = useState('');

  useEffect(() => {
    if (currentPrice && currentPrice.includes('-')) {
      const [min, max] = currentPrice.split('-');
      setCustomMinPrice(min);
      setCustomMaxPrice(max);
    } else {
      setCustomMinPrice('');
      setCustomMaxPrice('');
    }
  }, [currentPrice]);

  const handleFilterChange = (type: string, value: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(type, value);
    router.push(`/store?${searchParams.toString()}`);
  };

  const handleCustomPriceSubmit = () => {
    if (customMinPrice && customMaxPrice) {
      const customRange = `${customMinPrice}-${customMaxPrice}`;
      handleFilterChange('price', customRange);
    }
  };

  return (
    <div className="space-y-2">
      {/* Sort Order Filter */}
      <div>
        <label htmlFor="sort-select" className="mb-1 block text-sm font-medium">
          Sort by
        </label>
        <Select name="sort" value={currentSort || 'newest'} onValueChange={(value) => handleFilterChange('sort', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a sort order" />
          </SelectTrigger>
          <SelectContent>
            {sortOrders.map((order) => (
              <SelectItem key={order.value} value={order.value}>
                {order.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div>
        <label htmlFor="category-select" className="mb-1 block text-sm font-medium">
          Category
        </label>
        <Select name="category" value={currentCategory || 'all'} onValueChange={(value) => handleFilterChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {categories.map(
              (c: { name: string }) =>
                c.name && (
                  <SelectItem key={c.name} value={c.name}>
                    {c.name}
                  </SelectItem>
                ),
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Rating Filter */}
      <div>
        <label htmlFor="rating-select" className="mb-1 block text-sm font-medium">
          Review
        </label>
        <Select name="rating" value={currentRating || 'all'} onValueChange={(value) => handleFilterChange('rating', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a rating" />
          </SelectTrigger>
          <SelectContent>
            {ratings.map(
              (r) =>
                r.value && (
                  <SelectItem key={r.value} value={r.value}>
                    <Rating value={Number(r.value)} responsive />
                  </SelectItem>
                ),
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Price Filter */}
      <div>
        <label htmlFor="price-select" className="mb-1 block text-sm font-medium">
          Price
        </label>
        <div className="flex space-x-2">
          <Input type="number" placeholder="Min" value={customMinPrice} onChange={(e) => setCustomMinPrice(e.target.value)} className="w-1/2" />
          <Input type="number" placeholder="Max" value={customMaxPrice} onChange={(e) => setCustomMaxPrice(e.target.value)} className="w-1/2" />
        </div>
        <Button onClick={handleCustomPriceSubmit} disabled={!customMinPrice || !customMaxPrice} className="mt-3 w-full">
          Apply
        </Button>
      </div>

      {/* Clear Filters */}
      <div>
        <Link href="/store">
          <Button variant="destructive" disabled={currentCategory === 'all' && currentPrice === 'all' && currentRating === 'all' && currentSort === 'newest' && q === 'all'} className="w-full">
            Clear Filters
          </Button>
        </Link>
      </div>
    </div>
  );
}
