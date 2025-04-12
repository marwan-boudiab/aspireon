import CartButton from './cart-button';
import UserButton from './user-button';

const Menu = () => {
  return (
    <>
      <div>
        <nav className="flex w-full max-w-xs gap-4">
          <CartButton />
          <UserButton />
        </nav>
      </div>
    </>
  );
};

export default Menu;
