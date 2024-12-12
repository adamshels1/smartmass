import React from 'react';
import {View, StyleSheet} from 'react-native';
import Cart from 'features/cart/ui/Cart';

const CartScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Cart />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CartScreen;
