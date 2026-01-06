import { atom, computed } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent'; // 1. Импортируем persistentAtom

// Состояние открытия корзины (это сохранять не обязательно, пусть закрывается при обновлении)
export const isCartOpen = atom(false);

// 2. ЗАМЕНЯЕМ ОБЫЧНЫЙ atom НА persistentAtom
// 'marmol_cart' - это ключ (имя), под которым данные будут лежать в браузере
export const cartItems = persistentAtom('marmol_cart', [], {
  encode: JSON.stringify, // Превращаем массив в строку перед сохранением
  decode: JSON.parse      // Превращаем строку обратно в массив при чтении
});

// --- ВСЯ ОСТАЛЬНАЯ ЛОГИКА ОСТАЕТСЯ ПРЕЖНЕЙ ---

// Добавление товара
export function addCartItem(product, count = 1) {
  const existingEntry = cartItems.get().find(item => item.id === product.id && item.variant.size === product.variant.size);
  
  if (existingEntry) {
    cartItems.set(
      cartItems.get().map(item => 
        (item.id === product.id && item.variant.size === product.variant.size)
        ? { ...item, quantity: item.quantity + count }
        : item
      )
    );
  } else {
    cartItems.set([...cartItems.get(), { ...product, quantity: count }]);
  }
}

// Удаление товара
export function removeCartItem(itemId, itemSize) {
  cartItems.set(
    cartItems.get().filter(item => !(item.id === itemId && item.variant.size === itemSize))
  );
}

// Увеличить на 1
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

// Уменьшить на 1
export function decreaseItem(itemId, itemSize) {
  const items = cartItems.get();
  cartItems.set(
    items.map(item => {
      if (item.id === itemId && item.variant.size === itemSize) {
        const newQuantity = item.quantity - 1 > 0 ? item.quantity - 1 : 1;
        return { ...item, quantity: newQuantity };
      }
      return item;
    })
  );
}

// Полная очистка
export function clearCart() {
  cartItems.set([]);
}

// Подсчет общей суммы
export const cartTotal = computed(cartItems, items => {
  return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
});