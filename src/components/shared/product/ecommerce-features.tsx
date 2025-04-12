import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Headset, ShoppingBag, WalletCards } from 'lucide-react';

const EcommerceFeatures = () => {
  return (
    <Card className="mt-10 p-8 md:mt-24">
      <CardContent className="grid gap-4 gap-y-6 p-4 md:grid-cols-4">
        <div className="flex flex-col items-center space-y-2 text-center lg:items-start lg:text-left">
          <ShoppingBag />
          <div className="text-sm font-bold">Free Shipping</div>
          <div className="text-sm text-muted-foreground">Free shipping for order above $100</div>
        </div>
        <div className="flex flex-col items-center space-y-2 text-center lg:items-start lg:text-left">
          <DollarSign />
          <div className="text-sm font-bold">Money Guarantee</div>
          <div className="text-sm text-muted-foreground">Within 30 days for an exchange</div>
        </div>

        <div className="flex flex-col items-center space-y-2 text-center lg:items-start lg:text-left">
          <WalletCards />
          <div className="text-sm font-bold">Flexible Payment</div>
          <div className="text-sm text-muted-foreground">Pay with multiple credit cards</div>
        </div>

        <div className="flex flex-col items-center space-y-2 text-center lg:items-start lg:text-left">
          <Headset />
          <div className="text-sm font-bold">724 Support</div>
          <div className="text-sm text-muted-foreground">support customers</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EcommerceFeatures;
