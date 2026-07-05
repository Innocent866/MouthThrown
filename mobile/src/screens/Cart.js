import { View, Text, FlatList, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { brand, money } from '../theme';
import { useCart } from '../store';

export default function Cart({ navigate }) {
  const { cart, total, dispatch } = useCart();

  if (cart.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Pressable style={styles.btn} onPress={() => navigate('home')}>
          <Text style={styles.btnTxt}>Browse products</Text>
        </Pressable>
      </View>
    );
  }

  const checkout = () => {
    Alert.alert('Checkout', 'Complete your order on the MouthThrown website — your cart is waiting.', [
      { text: 'OK', onPress: () => dispatch({ type: 'clear' }) },
    ]);
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={cart}
        keyExtractor={(i) => i._id}
        contentContainerStyle={{ paddingBottom: 180 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.images?.[0] }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.price}>{money(item.price)} each</Text>
              <View style={styles.stepper}>
                <Pressable onPress={() => dispatch({ type: 'qty', id: item._id, qty: item.qty - 1 })}>
                  <Text style={styles.step}>−</Text>
                </Pressable>
                <Text style={styles.qty}>{item.qty}</Text>
                <Pressable onPress={() => dispatch({ type: 'qty', id: item._id, qty: item.qty + 1 })}>
                  <Text style={styles.step}>+</Text>
                </Pressable>
              </View>
            </View>
            <Pressable onPress={() => dispatch({ type: 'remove', id: item._id })}>
              <Text style={styles.remove}>✕</Text>
            </Pressable>
          </View>
        )}
      />
      <View style={styles.summary}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{money(total)}</Text>
        </View>
        <Pressable style={styles.btn} onPress={checkout}>
          <Text style={styles.btnTxt}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyTitle: { color: brand.text, fontSize: 20, fontWeight: '700' },
  row: {
    flexDirection: 'row', gap: 12, backgroundColor: brand.paper, borderRadius: 16,
    padding: 12, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(20,24,31,0.08)',
  },
  thumb: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#eee' },
  name: { color: brand.text, fontWeight: '700' },
  price: { color: brand.textSoft, fontSize: 12, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 6 },
  step: { color: brand.text, fontSize: 18, fontWeight: '800', paddingHorizontal: 6 },
  qty: { color: brand.text, fontWeight: '700' },
  remove: { color: brand.textSoft, fontSize: 16, padding: 6 },
  summary: {
    position: 'absolute', left: 12, right: 12, bottom: 16, backgroundColor: brand.ink,
    borderRadius: 20, padding: 18,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 16 },
  totalValue: { color: '#fff', fontWeight: '800', fontSize: 18 },
  btn: { backgroundColor: brand.gold, borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  btnTxt: { color: brand.ink, fontWeight: '800', fontSize: 15 },
});
