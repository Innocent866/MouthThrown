import { ScrollView, View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { brand, money } from '../theme';
import { useCart } from '../store';

export default function Product({ product, navigate }) {
  const { dispatch } = useCart();
  if (!product) return null;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Image source={{ uri: product.images?.[0] }} style={styles.image} />
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.rating}>
        ★ {(product.ratings?.averageRating || 0).toFixed(1)} · {product.ratings?.numberOfRatings || 0} ratings
      </Text>
      <Text style={styles.price}>{money(product.price)}</Text>
      <Text style={styles.stock}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Pressable
        style={styles.btn}
        onPress={() => { dispatch({ type: 'add', item: product }); navigate('cart'); }}
      >
        <Text style={styles.btnTxt}>Add to cart</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 16, paddingBottom: 120 },
  image: { width: '100%', aspectRatio: 1, borderRadius: 20, backgroundColor: '#eee' },
  category: { color: brand.textSoft, marginTop: 16 },
  name: { color: brand.text, fontSize: 24, fontWeight: '800', marginTop: 4 },
  rating: { color: brand.gold, marginTop: 6 },
  price: { color: brand.text, fontSize: 22, fontWeight: '800', marginTop: 12 },
  stock: { color: '#2e7d32', marginTop: 2 },
  description: { color: brand.textSoft, marginTop: 14, lineHeight: 21 },
  btn: { backgroundColor: brand.gold, borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 24 },
  btnTxt: { color: brand.ink, fontWeight: '800', fontSize: 16 },
});
