import { useCallback, useState } from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import { CartProvider, useCart } from './src/store';
import { brand } from './src/theme';
import Home from './src/screens/Home';
import Product from './src/screens/Product';
import Cart from './src/screens/Cart';

function Shell() {
  const [route, setRoute] = useState({ name: 'home', params: null });
  const { count } = useCart();
  const navigate = useCallback((name, params = null) => setRoute({ name, params }), []);

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor={brand.ink} />
      <View style={styles.header}>
        <Pressable onPress={() => navigate('home')}>
          <Text style={styles.logo}>
            Mouth<Text style={{ color: brand.gold }}>Thrown</Text>
          </Text>
        </Pressable>
        <Pressable style={styles.cartBtn} onPress={() => navigate('cart')}>
          <Text style={styles.cartTxt}>Cart{count > 0 ? ` (${count})` : ''}</Text>
        </Pressable>
      </View>

      {route.name === 'home' && <Home navigate={navigate} />}
      {route.name === 'product' && <Product product={route.params} navigate={navigate} />}
      {route.name === 'cart' && <Cart navigate={navigate} />}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Shell />
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: brand.bg },
  header: {
    backgroundColor: brand.ink, paddingHorizontal: 16, paddingVertical: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  logo: { color: '#fff', fontSize: 20, fontWeight: '800' },
  cartBtn: { backgroundColor: brand.gold, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  cartTxt: { color: brand.ink, fontWeight: '800' },
});
