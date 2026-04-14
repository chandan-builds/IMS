import React from 'react';
import { CategoryManager } from '../features/categories/components/CategoryManager';

export const CategoriesPage: React.FC = () => {
  return (
    <div className="p-6">
      <CategoryManager />
    </div>
  );
};
