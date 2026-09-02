import React from 'react';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products = [], onQuickView }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id || product._id || product.slug}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};
