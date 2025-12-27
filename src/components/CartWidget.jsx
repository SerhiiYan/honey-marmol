import React from 'react';
import { useStore } from '@nanostores/react';
import { isCartOpen, cartItems } from '../store/cartStore';

export default function CartWidget() {
  // Подписываемся на изменения магазина
  const $cartItems = useStore(cartItems);

  return (
    <button 
      onClick={() => isCartOpen.set(true)}
      className="relative p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer group"
    >
      {/* Иконка корзины (SVG) */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white group-hover:text-brand-yellow transition-colors">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>

      {/* Красный кружочек с цифрой (показываем только если товаров > 0) */}
      {$cartItems.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-brand-yellow text-brand-dark text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
          {$cartItems.length}
        </span>
      )}
    </button>
  );
}