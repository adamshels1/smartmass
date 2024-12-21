import React from 'react';
import Cart from 'features/cart/ui/Cart';
import {AppLayout} from 'shared/ui/AppLayout/AppLayout.tsx';

const CartScreen: React.FC = () => {
  return (
    <AppLayout>
      <Cart />
    </AppLayout>
  );
};

export default CartScreen;
