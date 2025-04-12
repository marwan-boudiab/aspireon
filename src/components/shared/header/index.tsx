import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import Search from './search';

// import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
// import { Button } from '@/components/ui/button';
// import { MenuIcon } from 'lucide-react';
// import { getAllCategories } from '@/lib/actions/product.actions';

const Header = async () => {
  // const categories = await getAllCategories()
  return (
    <header className="w-full">
      <div className="flex-between h-16 items-center">
        {/* <Drawer direction="left">
            <DrawerTrigger asChild>
              <Button variant="ghost">
                <MenuIcon />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Select a category</DrawerTitle>
                <div className="space-y-1">
                  {categories.map((category: { name: string }) => (
                    <Button
                      className="w-full justify-start"
                      variant="ghost"
                      key={category.name}
                      asChild
                    >
                      <DrawerClose asChild>
                        <Link href={`/store?category=${category.name}`}>
                          {category.name}
                        </Link>
                      </DrawerClose>
                    </Button>
                  ))}
                </div>
              </DrawerHeader>
            </DrawerContent>
          </Drawer> */}
        <Link href="/" className="flex-start">
          <Image src="/assets/icons/logo.png" width={512} height={512} alt={`${APP_NAME} logo`} className="h-10 w-10" />
          {/* {APP_NAME.slice(1)} */}
        </Link>

        <div className="mx-auto hidden md:block">
          <Search />
        </div>
        <Menu />
      </div>
      <div className="block md:hidden">
        <Search />
      </div>
    </header>
  );
};

export default Header;
