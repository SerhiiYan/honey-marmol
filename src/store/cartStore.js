// src/store/cartStore.js
import { atom } from 'nanostores';

// Состояние: открыта корзина или нет
export const isCartOpen = atom(false);

// Состояние: массив товаров в корзине
export const cartItems = atom([]); 

/**
 * Функция добавления товара (пока простая, позже допишем логику)
 * @param {object} product - товар
 */
export function addCartItem(product) {
  // Пока просто добавляем в массив
  cartItems.set([...cartItems.get(), product]);
  isCartOpen.set(true); // Открываем корзину при добавлении
}