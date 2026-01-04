import React, { useState } from 'react';
import { addCartItem } from '../store/cartStore';

export default function ProductCard({ product }) {
  // 1. ПРОВЕРЯЕМ: Если inStock === false, значит товара нет
  const isOutOfStock = product.inStock === false;

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [isAdded, setIsAdded] = useState(false);
  const [count, setCount] = useState(1);

  const increment = () => setCount(prev => (prev < 99 ? prev + 1 : prev));
  const decrement = () => setCount(prev => (prev > 1 ? prev - 1 : prev));

  const handleAddToCart = () => {
    // 2. БЛОКИРУЕМ: Если товара нет, кнопка не работает
    if (isOutOfStock) return;

    addCartItem({
      id: product.id,
      name: product.name,
      variant: selectedVariant,
      image: product.image,
      price: selectedVariant.price
    }, count); 
    
    setIsAdded(true);
    setCount(1);
    setTimeout(() => {
        setIsAdded(false);
    }, 1000);
  };

  return (
    // 3. СТИЛЬ: Добавляем grayscale и прозрачность, если товара нет
    <div className={`group relative bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 flex flex-col h-full
        ${isOutOfStock ? 'opacity-75 grayscale' : 'hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl hover:shadow-brand-yellow/20'}
    `}>
      
      {/* Свечение (показываем только если есть в наличии) */}
      {!isOutOfStock && (
        <div className="absolute inset-0 bg-brand-yellow/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
      )}

      {/* Бейджи */}
      <div className="absolute top-4 left-4 flex gap-2 z-10 flex-wrap">
        {/* Если нет - пишем РАСПРОДАНО */}
        {isOutOfStock ? (
             <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider shadow-lg border border-white/20">
                Распродано
            </span>
        ) : (
            product.badges.map(badge => (
            <span key={badge} className="bg-brand-yellow text-black text-xs font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
                {badge}
            </span>
            ))
        )}
      </div>

      {/* ССЫЛКА (Работает всегда) */}
      <a href={`/product/${product.id}`} className={`contents ${isOutOfStock ? 'cursor-default' : 'cursor-pointer'}`}>
          
          <div className="relative z-10 h-64 flex items-center justify-center mb-4">
            <img 
                src={product.image} 
                alt={product.name} 
                style={{ viewTransitionName: `image-${product.id}` }}
                // Если нет в наличии - убираем увеличение при наведении
                className={`h-full object-contain drop-shadow-xl transition-transform duration-500 
                    ${isOutOfStock ? 'opacity-80' : 'group-hover:scale-110'}
                `}
            />
          </div>

          <div className="relative z-10 text-center flex-grow flex flex-col mb-4">
            <h3 className="text-2xl font-heading font-bold text-white mb-2 leading-none group-hover:text-brand-yellow transition-colors">
                {product.name}
            </h3>
            
            <p className="text-gray-400 text-sm line-clamp-3 min-h-[60px]">
                {product.description}
            </p>
          </div>
      </a>

      <div className="mt-auto relative z-20">
            <div className="flex items-center justify-between mb-6">
                
                {/* Выбор размера (Блокируем стиль, если нет) */}
                <div className="flex gap-1 flex-wrap">
                    {product.variants.map((variant) => (
                        <button
                        key={variant.size}
                        onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                        disabled={isOutOfStock}
                        className={`px-2 py-1 rounded text-[10px] font-bold border transition-all 
                            ${isOutOfStock ? 'cursor-not-allowed opacity-50 border-gray-700 text-gray-500' : 'cursor-pointer'}
                            ${selectedVariant.size === variant.size && !isOutOfStock
                                ? 'bg-white text-brand-dark border-white' 
                                : isOutOfStock ? '' : 'bg-transparent text-gray-400 border-gray-600 hover:border-white hover:text-white'}`}
                        >
                        {variant.size}
                        </button>
                    ))}
                </div>

                {/* Счетчик (Блокируем если нет) */}
                <div className={`flex items-center border border-white/10 rounded-lg ${isOutOfStock ? 'bg-gray-800/50 opacity-50' : 'bg-brand-dark/50'}`}>
                    <button 
                        onClick={decrement} 
                        disabled={isOutOfStock}
                        className={`px-3 py-1 text-gray-400 text-lg leading-none ${isOutOfStock ? 'cursor-not-allowed' : 'hover:text-white cursor-pointer'}`}
                    >-</button>
                    <span className="text-white font-bold w-4 text-center text-sm">{count}</span>
                    <button 
                        onClick={increment} 
                        disabled={isOutOfStock}
                        className={`px-3 py-1 text-gray-400 text-lg leading-none ${isOutOfStock ? 'cursor-not-allowed' : 'hover:text-brand-yellow cursor-pointer'}`}
                    >+</button>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="text-left">
                    <div className="text-xs text-gray-500">Цена за шт:</div>
                    {/* Перечеркнутая цена */}
                    <div className={`text-xl font-bold whitespace-nowrap ${isOutOfStock ? 'text-gray-500 line-through' : 'text-brand-yellow'}`}>
                        {selectedVariant.price} BYN
                    </div>
                </div>
                
                {/* КНОПКА (Серая если нет) */}
                <button 
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAdded} 
                    className={`
                        font-bold py-2 px-6 rounded-lg transition-all duration-300 min-w-[140px] flex items-center justify-center border
                        ${isOutOfStock 
                            ? 'bg-transparent border-white/10 text-gray-500 cursor-not-allowed' 
                            : isAdded 
                                ? 'bg-white text-brand-dark shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105 border-transparent cursor-pointer' 
                                : 'bg-brand-yellow border-brand-yellow text-brand-dark hover:bg-white hover:text-black cursor-pointer'}
                    `}
                >
                    {isOutOfStock ? "Нет в наличии" : (
                        isAdded ? (
                            <span className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                                {/* Галочка */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
                                В корзине
                            </span>
                        ) : (
                            count > 1 ? `Купить (${count})` : "Купить"
                        )
                    )}
                </button>
            </div>
        </div>
    </div>
  );
}