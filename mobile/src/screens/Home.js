import { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api';
import { brand } from '../theme';

export default function Home({ navigate }) {
  const [products, setProducts] = useState(null);
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => { fetchProducts().then(setProducts); }, []);

  // debounce the search box
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const visible = useMemo(() => {
    if (!products) return [];
    const q = debounced.trim().toLowerCase();
    return q ? products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q)) : products;
  }, [products, debounced]);

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Everything you love,{'\n'}<Text style={{ color: brand.gold }}>thrown your way.</Text></Text>
      <TextInput
        style={styles.search}
        placeholder="Search products…"
        placeholderTextColor={brand.textSoft}
        value={query}
        onChangeText={setQuery}
      />
      {products === null ? (
        <ActivityIndicator color={brand.gold} style={{ marginTop: 48 }} size="large" />
      ) : (
        // FlatList = built-in list virtualization
        <FlatList
          data={visible}
          numColumns={2}
          keyExtractor={(p) => p._id}
          initialNumToRender={6}
          windowSize={5}
          removeClippedSubviews
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => navigate('product', item)} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 10 },
  heading: { color: brand.text, fontSize: 26, fontWeight: '800', marginVertical: 16, lineHeight: 32 },
  search: {
    backgroundColor: brand.paper, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(20,24,31,0.1)', color: brand.text, marginBottom: 10,
  },
});
