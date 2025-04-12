import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { getAllCategories } from '@/lib/actions/product.actions';
import { SearchIcon } from 'lucide-react';

export default async function Search() {
  // const categories = await getAllCategories()

  return (
    <form action="/store" method="GET">
      <div className="relative flex w-full max-w-sm items-center">
        {/* <Select name="category">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={'All'} value={'all'}>
              All
            </SelectItem>
            {categories.map((category: { name: string }) => (
              <SelectItem key={category.name} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}

        <Input name="q" type="text" placeholder="Search" className="lg:w-[400px]" />
        <Button variant={'ghost'} size={'icon'} className="absolute right-0 top-0 scale-75 p-2" type="submit">
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
}
