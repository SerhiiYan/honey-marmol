import React, { useState } from 'react';
import { addCartItem } from '../store/cartStore';

export default function ProductViewer({ product }) {
  // 1. ПРОВЕРКА НАЛИЧИЯ
  const isOutOfStock = product.inStock === false;

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [count, setCount] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const increment = () => setCount(prev => (prev < 99 ? prev + 1 : prev));
  const decrement = () => setCount(prev => (prev > 1 ? prev - 1 : prev));

  const handleAddToCart = () => {
    // Если нет в наличии - стоп
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
    setTimeout(() => setIsAdded(false), 1000); 
  };

  return (
    <div className="flex flex-col h-full justify-center">
        
        {/* БЕЙДЖИ */}
        <div className="flex gap-2 mb-6 flex-wrap">
            {/* Если нет в наличии - показываем только этот бейдж */}
            {isOutOfStock ? (
                <span className="bg-gray-700 text-white px-3 py-1 text-sm font-bold uppercase tracking-wider rounded">
                    Распродано
                </span>
            ) : (
                product.badges.map(badge => (
                    <span key={badge} className="bg-brand-yellow text-black px-3 py-1 text-sm font-bold uppercase tracking-wider rounded">
                        {badge}
                    </span>
                ))
            )}
            
            <span className="border border-gray-600 text-gray-400 px-3 py-1 text-sm uppercase tracking-wider rounded">
                {product.category === 'honey' ? 'Мёд' : 
                 product.category === 'tea' ? 'Чай' : 
                 product.category === 'packaging' ? 'Упаковка' : 'Натурпродукт'}
            </span>
        </div>

        {/* ЗАГОЛОВОК (Если нет в наличии - делаем серым) */}
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight ${isOutOfStock ? 'text-gray-500' : 'text-white'}`}>
            {product.name}
        </h1>

        {/* ОПИСАНИЕ */}
        <p className="text-gray-300 text-lg leading-relaxed mb-8 border-l-2 border-brand-yellow pl-4">
            {product.description}
        </p>

        {/* ВЫБОР ВАРИАНТА */}
        <div className="mb-8">
            <p className="text-sm text-gray-500 mb-3 font-bold uppercase tracking-widest">
                {product.category === 'packaging' ? 'Выберите размер:' : 'Выберите объем:'}
            </p>
            <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                    <button
                        key={variant.size}
                        onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                        disabled={isOutOfStock}
                        className={`px-6 py-3 rounded-lg text-sm font-bold border transition-all flex flex-col items-center min-w-[100px]
                        ${isOutOfStock 
                            ? 'opacity-50 cursor-not-allowed bg-transparent border-gray-700 text-gray-500' // Стиль отключенной кнопки
                            : selectedVariant.size === variant.size 
                                ? 'bg-white text-brand-dark border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105 cursor-pointer' 
                                : 'bg-white/5 text-gray-400 border-white/10 hover:border-brand-yellow hover:text-white cursor-pointer'
                        }`}
                    >
                        <span className="text-lg">{variant.size}</span>
                        <span className="text-xs opacity-70 mt-1 font-normal">{variant.price} BYN</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="h-px bg-white/10 w-full mb-8"></div>

        {/* НИЖНИЙ БЛОК */}
        <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center mt-auto">
            
            <div className="flex w-full xl:w-auto items-center justify-between gap-6">
                
                {/* ЦЕНА */}
                <div>
                    <div className={`text-3xl font-bold whitespace-nowrap ${isOutOfStock ? 'text-gray-500 line-through' : 'text-brand-yellow'}`}>
                        {selectedVariant.price} BYN
                    </div>
                    <div className="text-sm text-gray-500">Цена за 1 шт.</div>
                </div>

                {/* СЧЕТЧИК (Отключаем, если нет) */}
                <div className={`flex items-center border border-white/10 rounded-lg h-14 ${isOutOfStock ? 'bg-white/5 opacity-50 cursor-not-allowed' : 'bg-white/5'}`}>
                    <button 
                        onClick={decrement} 
                        disabled={isOutOfStock}
                        className={`w-12 h-full text-xl leading-none rounded-l-lg ${isOutOfStock ? 'text-gray-600' : 'text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer'}`}
                    >-</button>
                    
                    <span className={`font-bold w-10 text-center text-lg ${isOutOfStock ? 'text-gray-600' : 'text-white'}`}>{count}</span>
                    
                    <button 
                        onClick={increment} 
                        disabled={isOutOfStock}
                        className={`w-12 h-full text-xl leading-none rounded-r-lg ${isOutOfStock ? 'text-gray-600' : 'text-gray-400 hover:text-brand-yellow hover:bg-white/5 cursor-pointer'}`}
                    >+</button>
                </div>
            </div>

            {/* КНОПКА КУПИТЬ (Меняем на "Нет в наличии") */}
            <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdded}
                className={`
                    h-14 w-full xl:w-auto px-10 rounded-lg font-bold font-heading uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 text-lg shrink-0 border
                    ${isOutOfStock 
                        ? 'bg-transparent border-white/10 text-gray-500 cursor-not-allowed' // Стиль Нет в наличии
                        : isAdded 
                            ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.5)] border-transparent cursor-pointer' 
                            : 'bg-brand-yellow text-brand-dark border-brand-yellow hover:bg-white hover:text-black cursor-pointer'}
                `}
            >
                {isOutOfStock ? "Нет в наличии" : (
                    isAdded ? (
                        <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
                        В корзине
                        </>
                    ) : (
                        'В корзину'
                    )
                )}
            </button>
        </div>
        
    </div>
  );
}