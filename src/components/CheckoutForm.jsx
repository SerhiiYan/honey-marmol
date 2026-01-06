import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, cartTotal, clearCart } from '../store/cartStore';

export default function CheckoutForm() {
  const $cartItems = useStore(cartItems);
  const $cartTotal = useStore(cartTotal);

  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    method: 'courier', // courier, postal, pickup
    address: '',
    comment: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Подготовка данных
    const payload = {
      ...formData,
      items: $cartItems,
      total: $cartTotal
    };

    try {
      const response = await fetch('/telegram.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsSuccess(true);
        clearCart(); // Очищаем корзину после заказа!
        
        // Тут можно сделать редирект на страницу спасибо, или показать сообщение
        // window.location.href = '/success';
      } else {
        alert('Ошибка отправки. Попробуйте написать нам в Telegram/Instagram.');
      }
    } catch (error) {
      console.error(error);
      alert('Ошибка соединения. Проверьте интернет.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Если заказ успешен - показываем сообщение
  if (isSuccess) {
    return (
      <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 text-black">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
        </div>
        <h2 className="text-4xl font-heading font-bold text-white mb-4">Заказ принят!</h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            Спасибо, {formData.name}! Мы уже получили вашу заявку. <br/>
            Менеджер свяжется с вами в ближайшее время для подтверждения.
        </p>
        <a href="/" className="inline-block px-8 py-3 bg-brand-yellow text-black font-bold uppercase tracking-widest rounded hover:bg-white transition-colors">
            На главную
        </a>
      </div>
    );
  }

  // Если корзина пуста (человек зашел по прямой ссылке)
  if ($cartItems.length === 0) {
    return (
        <div className="text-center py-20">
            <p className="text-gray-400 mb-6">Ваша корзина пуста</p>
            <a href="/catalog" className="text-brand-yellow border-b border-brand-yellow pb-1 hover:text-white">Перейти в каталог</a>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* ЛЕВАЯ КОЛОНКА: ФОРМА */}
        <div className="bg-[#1A1A1A] p-6 md:p-8 rounded-2xl border border-white/5">
            <h2 className="text-2xl font-heading font-bold text-white mb-6 uppercase">Оформление</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Имя */}
                <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Ваше имя</label>
                    <input 
                        type="text" 
                        name="name" 
                        required 
                        placeholder="Иван"
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-yellow focus:outline-none transition-colors"
                        onChange={handleChange}
                    />
                </div>

                {/* Телефон */}
                <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Телефон</label>
                    <input 
                        type="tel" 
                        name="phone" 
                        required 
                        placeholder="+375 (29) ..."
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-yellow focus:outline-none transition-colors"
                        onChange={handleChange}
                    />
                </div>

                {/* Выбор доставки (Табы) */}
                <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Способ доставки</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button 
                            type="button"
                            onClick={() => setFormData(p => ({...p, method: 'courier'}))}
                            className={`py-3 rounded-lg text-sm font-bold border transition-all ${formData.method === 'courier' ? 'bg-brand-yellow text-black border-brand-yellow' : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'}`}
                        >
                            Гродно
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData(p => ({...p, method: 'postal'}))}
                            className={`py-3 rounded-lg text-sm font-bold border transition-all ${formData.method === 'postal' ? 'bg-brand-yellow text-black border-brand-yellow' : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'}`}
                        >
                            Почта
                        </button>
                        <button 
                            type="button"
                            onClick={() => setFormData(p => ({...p, method: 'pickup'}))}
                            className={`py-3 rounded-lg text-sm font-bold border transition-all ${formData.method === 'pickup' ? 'bg-brand-yellow text-black border-brand-yellow' : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'}`}
                        >
                            Самовывоз
                        </button>
                    </div>
                </div>

                {/* Адрес (Скрываем если самовывоз) */}
                {formData.method !== 'pickup' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                            {formData.method === 'courier' ? 'Адрес доставки (Улица, Дом, Подъезд)' : 'Адрес (Город, Улица, Индекс)'}
                        </label>
                        <textarea 
                            name="address" 
                            required 
                            rows="2"
                            placeholder="ул. Советская 1, кв. 10..."
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-yellow focus:outline-none transition-colors resize-none"
                            onChange={handleChange}
                        ></textarea>
                    </div>
                )}

                {/* Адрес Самовывоза (Инфо) */}
                {formData.method === 'pickup' && (
                    <div className="bg-brand-yellow/10 border border-brand-yellow/20 rounded-lg p-4 text-sm text-gray-300 animate-in fade-in">
                        📍 <strong>Пункт выдачи:</strong> г. Гродно, мкр. Южный-4. <br/>
                        Мы свяжемся с вами и договоримся о точном времени.
                    </div>
                )}

                {/* Комментарий */}
                <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Комментарий к заказу (необязательно)</label>
                    <input 
                        type="text" 
                        name="comment" 
                        placeholder="Код домофона, детали упаковки..."
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-yellow focus:outline-none transition-colors"
                        onChange={handleChange}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-brand-yellow text-black font-bold font-heading uppercase tracking-widest py-4 rounded-lg hover:bg-white transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Отправка...' : 'Подтвердить заказ'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                    Нажимая кнопку, вы соглашаетесь на обработку данных. Оплата производится при получении.
                </p>

            </form>
        </div>

        {/* ПРАВАЯ КОЛОНКА: ВАШ ЗАКАЗ */}
        <div className="bg-[#1A1A1A] p-6 md:p-8 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold text-white mb-6 uppercase">Ваш заказ</h2>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                {$cartItems.map(item => (
                    <div key={`${item.id}-${item.variant.size}`} className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-white/5 rounded-lg p-2 flex items-center justify-center shrink-0 border border-white/5">
                            <img src={item.image} alt={item.name} className="h-full object-contain" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-bold text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.variant.size} x {item.quantity} шт.</p>
                        </div>
                        <div className="font-bold text-brand-yellow whitespace-nowrap">
                            {item.price * item.quantity} BYN
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between items-end">
                    <span className="text-gray-400">Итого:</span>
                    <span className="text-3xl font-heading font-bold text-white">{$cartTotal} BYN</span>
                </div>
            </div>
        </div>

    </div>
  );
}