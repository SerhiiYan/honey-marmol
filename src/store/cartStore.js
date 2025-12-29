// src/store/cartStore.js
import { atom, computed } from 'nanostores';

export const isCartOpen = atom(false);
export const cartItems = atom([]);

// Добавление товара
export function addCartItem(product, count = 1) {
  const existingEntry = cartItems.get().find(item => item.id === product.id && item.variant.size === product.variant.size);
  
  if (existingEntry) {
    // Если товар есть, прибавляем count к текущему количеству
    cartItems.set(
      cartItems.get().map(item => 
        (item.id === product.id && item.variant.size === product.variant.size)
        ? { ...item, quantity: item.quantity + count }
        : item
      )
    );
  } else {
    // Если товара нет, создаем запись с quantity: count
    cartItems.set([...cartItems.get(), { ...product, quantity: count }]);
  }
}

// Удаление товара
export function removeCartItem(itemId, itemSize) {
  cartItems.set(
    cartItems.get().filter(item => !(item.id === itemId && item.variant.size === itemSize))
  );
}

// Подсчет общей суммы (Computed - вычисляется сама)
export const cartTotal = computed(cartItems, items => {
  return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
});

export function clearCart() {
  cartItems.set([]); // Просто превращаем массив в пустой
}

export function increaseItem(itemId, itemSize) {
  const items = cartItems.get();
  cartItems.set(
    items.map(item => {
      if (item.id === itemId && item.variant.size === itemSize) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    })
  );
}

// Уменьшить на 1 (если ставит 1, то не удаляет, а останавливается на 1)
export function decreaseItem(itemId, itemSize) {
  const items = cartItems.get();
  cartItems.set(
    items.map(item => {
      if (item.id === itemId && item.variant.size === itemSize) {
        // Не даем уйти в ноль или минус
        const newQuantity = item.quantity - 1 > 0 ? item.quantity - 1 : 1;
        return { ...item, quantity: newQuantity };
      }
      return item;
    })
  );
}
