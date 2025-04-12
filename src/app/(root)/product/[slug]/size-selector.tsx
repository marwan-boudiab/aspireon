// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Button } from '@/components/ui/button';

// type SizeSelectorProps = {
//   sizes: string[];
//   currentSize?: string;
//   productSlug: string;
// };

// const SizeSelector = ({ sizes, currentSize }: SizeSelectorProps) => {
//   // USE ROUTER FOR NAVIGATION
//   const router = useRouter();
//   // USE SEARCH PARAMS FOR URL MANIPULATION
//   const searchParams = useSearchParams();
//   // USE STATE FOR ACTIVE SIZE
//   const [activeSize, setActiveSize] = useState(currentSize || sizes[0]);

//   // HANDLE SIZE CHANGE
//   useEffect(() => {
//     // GET SIZE FROM URL
//     const params = new URLSearchParams(searchParams);
//     const sizeFromUrl = params.get('size');

//     // UPDATE URL WITH ACTIVE SIZE
//     if (!sizeFromUrl) {
//       params.set('size', activeSize);
//       router.replace(`?${params.toString()}`, { scroll: false });
//     } else if (sizeFromUrl !== activeSize) {
//       setActiveSize(sizeFromUrl);
//     }
//   }, [searchParams, activeSize, router]);

//   const handleSizeChange = (value: string) => {
//     // AVOID REDUNDANT UPDATES
//     if (value === activeSize) return;
//     // UPDATE ACTIVE SIZE STATE
//     setActiveSize(value);
//     // UPDATE URL PARAM WITH NEW SIZE
//     const params = new URLSearchParams(searchParams);
//     params.set('size', value);
//     router.push(`?${params.toString()}`, { scroll: false });
//   };

//   // RENDER SIZE SELECTOR
//   return (
//     <div className="flex flex-wrap gap-2">
//       {sizes.map((size) => (
//         <Button variant={activeSize === size ? 'default' : 'outline'} className="w-10" key={size} onClick={() => handleSizeChange(size)}>
//           {size}
//         </Button>
//       ))}
//     </div>
//   );
// };

// export default SizeSelector;

'use client';
import { Button } from '@/components/ui/button';
import { useSizeStore } from '@/store';
import { useEffect } from 'react';

type SizeSelectorProps = {
  sizes: string[];
  productSlug: string;
};

const SizeSelector = ({ sizes }: SizeSelectorProps) => {
  const { activeSize, setActiveSize } = useSizeStore();

  useEffect(() => {
    setActiveSize(sizes[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSizeChange = (value: string) => {
    if (value === activeSize) return;
    setActiveSize(value);
  };

  return (
    <div className="max-w-none sm:max-w-[18rem]">
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Button variant={activeSize === size ? 'default' : 'outline'} className="w-10" key={size} onClick={() => handleSizeChange(size)}>
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
