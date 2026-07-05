import { memo } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { brand, money } from '../theme';
import { useCart } from '../store';

// Memoized so FlatList re-renders only changed rows
const ProductCard = memo(function ProductCard({ product, onPress }) {
  const { dispatch } = useCart();
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.images?.[0] }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.rating}>★ {(product.ratings?.averageRating || 0).toFixed(1)} ({product.ratings?.numberOfRatings || 0})</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{money(product.price)}</Text>
          <Pressable style={styles.addBtn} onPress={() => dispatch({ type: 'add', item: product })}>
            <Text style={styles.addTxt}>+ Add</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1, margin: 6, backgroundColor: brand.paper, borderRadius: 16,
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(20,24,31,0.08)',
  },
  image: { width: '100%', aspectRatio: 1, backgroundColor: '#eee' },
  body: { padding: 10 },
  category: { color: brand.textSoft, fontSize: 11, marginBottom: 2 },
  name: { color: brand.text, fontWeight: '700', fontSize: 14 },
  rating: { color: brand.gold, fontSize: 12, marginVertical: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: { color: brand.text, fontWeight: '800', fontSize: 15 },
  addBtn: { backgroundColor: brand.ink, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  addTxt: { color: brand.gold, fontWeight: '700', fontSize: 12 },
});

export default ProductCard;
