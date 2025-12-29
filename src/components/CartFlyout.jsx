import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
// Импортируем НОВЫЕ функции increaseItem, decreaseItem
import { isCartOpen, cartItems, removeCartItem, increaseItem, decreaseItem, cartTotal, clearCart } from '../store/cartStore';

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);
  const $cartTotal = useStore(cartTotal);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!$isCartOpen) setConfirmClear(false);
  }, [$isCartOpen]);

  const handleClearClick = () => {
    if (confirmClear) {
        clearCart();
        setConfirmClear(false);
    } else {
        setConfirmClear(true);
        setTimeout(() => setConfirmClear(false), 3000);
    }
  };
  
  // Функция рендера остального макета такая же...
  return (
    <>
      {$isCartOpen && (
        <div onClick={() => isCartOpen.set(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity" />
      )}

      <aside className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#18181b] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out ${$isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Хедер (без изменений) */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#1A1A1A]">
             {/* ... тут твой код с кнопкой очистки и закрытия ... */}
             <div className="flex items-center gap-4">
                <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider">Корзина</h2>
                {$cartItems.length > 0 && (
                    <button onClick={handleClearClick} className={`transition-all duration-200 text-xs font-bold px-2 py-1 rounded ${confirmClear ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 hover:text-red-500'}`} title="Очистить всё">
                        {confirmClear ? "УДАЛИТЬ ВСЁ?" : (
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        )}
                    </button>
                )}
            </div>
            <button onClick={() => isCartOpen.set(false)} className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* СПИСОК ТОВАРОВ (Вот тут изменения) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {$cartItems.length === 0 ? (
               // ... код пустой корзины без изменений ...
               <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                <p>Корзина пуста</p>
                <button onClick={() => isCartOpen.set(false)} className="mt-4 text-brand-yellow hover:underline cursor-pointer">Перейти в каталог</button>
               </div>
            ) : (
              $cartItems.map((item) => (
                <div key={`${item.id}-${item.variant.size}`} className="flex gap-4 items-center animate-in slide-in-from-right duration-300">
                  
                  {/* Картинка */}
                  <div className="w-16 h-16 bg-white/5 rounded-lg p-2 flex items-center justify-center shrink-0 border border-white/5">
                    <img src={item.image} alt={item.name} className="h-full object-contain" />
                  </div>
                  
                  {/* Название и Управление количеством (Центр) */}
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm leading-tight pr-2">{item.name}</h3>
                    <p className="text-gray-400 text-xs mt-1 mb-2">
                        {item.variant.size}
                    </p>

                    {/* СЧЕТЧИК ПРЯМО В КОРЗИНЕ */}
                    <div className="flex items-center bg-black/40 rounded-lg w-max border border-white/10">
                        <button 
                            onClick={() => decreaseItem(item.id, item.variant.size)}
                            className="px-2 py-1 text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-l-lg"
                        >
                            -
                        </button>
                        <span className="text-brand-yellow font-bold w-6 text-center text-sm">{item.quantity}</span>
                        <button 
                            onClick={() => increaseItem(item.id, item.variant.size)}
                            className="px-2 py-1 text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-r-lg"
                        >
                            +
                        </button>
                    </div>
                  </div>

                  {/* Цена и Удалить (Справа) */}
                  <div className="flex flex-col items-end justify-between h-16">
                     <p className="font-bold text-white text-sm whitespace-nowrap">
                        {item.price * item.quantity} BYN
                     </p>
                     
                     <button 
                        onClick={() => removeCartItem(item.id, item.variant.size)}
                        className="text-xs text-red-900/60 hover:text-red-500 transition-colors cursor-pointer uppercase tracking-wider font-bold"
                     >
                        Удалить
                     </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Футер (без изменений) */}
          {$cartItems.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#111]">
              <div className="flex justify-between items-end mb-4">
                <span className="text-gray-400 text-sm">Итого:</span>
                <span className="text-3xl font-heading font-bold text-brand-yellow">{$cartTotal} BYN</span>
              </div>
              <a href="/checkout" className="block w-full bg-brand-yellow text-brand-dark text-center font-bold font-heading uppercase tracking-widest py-4 hover:bg-white transition-colors cursor-pointer rounded-sm">
                Оформить заказ
              </a>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}