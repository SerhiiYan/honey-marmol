import React, { useState } from 'react';
import { addCartItem } from '../store/cartStore';

export default function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [isAdded, setIsAdded] = useState(false);
  
  // Локальное состояние счетчика (по умолчанию 1)
  const [count, setCount] = useState(1);

  // Функции для плюса и минуса
  const increment = () => setCount(prev => (prev < 99 ? prev + 1 : prev));
  const decrement = () => setCount(prev => (prev > 1 ? prev - 1 : prev));

  const handleAddToCart = () => {
    // Передаем count вторым аргументом!
    addCartItem({
      id: product.id,
      name: product.name,
      variant: selectedVariant,
      image: product.image,
      price: selectedVariant.price
    }, count); // <--- Важно!
    
    // Анимация кнопки
    setIsAdded(true);
    
    // Сбрасываем количество обратно на 1 после добавления? 
    // Обычно удобнее сбросить, чтобы случайно не купить еще 10.
    setCount(1);

    setTimeout(() => {
        setIsAdded(false);
    }, 1000);
  };

  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl hover:shadow-brand-yellow/20 flex flex-col h-full">
      
      {/* Свечение */}
      <div className="absolute inset-0 bg-brand-yellow/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>

      {/* Бейджи */}
      <div className="absolute top-4 left-4 flex gap-2 z-10 flex-wrap">
        {product.badges.map(badge => (
          <span key={badge} className="bg-brand-yellow text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
            {badge}
          </span>
        ))}
      </div>

      {/* Изображение */}
      <div className="relative z-10 h-64 flex items-center justify-center mb-4">
        <img 
            src={product.image} 
            alt={product.name} 
            className="h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Информация */}
      <div className="relative z-10 text-center flex-grow flex flex-col">
        <h3 className="text-2xl font-heading font-bold text-white mb-2 leading-none">
            {product.name}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 min-h-[60px]">
            {product.description}
        </p>

        <div className="mt-auto">
            {/* Ряд с выбором размера и счетчиком */}
            <div className="flex items-center justify-between mb-6">
                
                {/* Выбор размера (Слева) */}
                <div className="flex gap-1 flex-wrap">
                    {product.variants.map((variant) => (
                        <button
                        key={variant.size}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-2 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer
                            ${selectedVariant.size === variant.size 
                                ? 'bg-white text-brand-dark border-white' 
                                : 'bg-transparent text-gray-400 border-gray-600 hover:border-white hover:text-white'}`}
                        >
                        {variant.size}
                        </button>
                    ))}
                </div>

                {/* Счетчик количества (Справа) */}
                <div className="flex items-center bg-brand-dark/50 border border-white/10 rounded-lg">
                    <button 
                        onClick={decrement}
                        className="px-3 py-1 text-gray-400 hover:text-white transition-colors cursor-pointer text-lg leading-none"
                    >
                        -
                    </button>
                    <span className="text-white font-bold w-4 text-center text-sm">{count}</span>
                    <button 
                        onClick={increment}
                        className="px-3 py-1 text-gray-400 hover:text-brand-yellow transition-colors cursor-pointer text-lg leading-none"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Цена и кнопка */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="text-left">
                    
                    {/* УМНАЯ ЛОГИКА ТУТ: Если id='royal-jelly', пишем "за грамм", иначе "за шт" */}
                    <div className="text-xs text-gray-500">
                        {product.id === 'royal-jelly' ? 'Цена за грамм:' : 'Цена за шт:'}
                    </div>
                    
                    <div className="text-xl font-bold text-brand-yellow whitespace-nowrap">
                        {selectedVariant.price} BYN
                    </div>
                </div>
                
                <button 
                    onClick={handleAddToCart}
                    disabled={isAdded} 
                    className={`
                        font-bold py-2 px-6 rounded-lg transition-all duration-300 cursor-pointer min-w-[140px] flex items-center justify-center
                        ${isAdded 
                            ? 'bg-white text-brand-dark shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105' 
                            : 'bg-brand-yellow text-brand-dark hover:bg-white hover:text-black'}
                    `}
                >
                    {isAdded ? (
                        <span className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                             {/* Галочка */}
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                             В корзине
                        </span>
                    ) : (
                        count > 1 ? `Купить (${count})` : "Купить"
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}