import React from 'react';
import { Badge } from '../ui/Badge';

interface StockBadgeProps {
  quantity: number;
  lowStockThreshold?: number;
}

const StockBadge: React.FC<StockBadgeProps> = ({ quantity, lowStockThreshold = 10 }) => {
  let variant: 'success' | 'warning' | 'danger' = 'success';
  let text = 'In Stock';

  if (quantity <= 0) {
    variant = 'danger';
    text = 'Out of Stock';
  } else if (quantity <= lowStockThreshold) {
    variant = 'warning';
    text = 'Low Stock';
  }

  return <Badge variant={variant}>{text}</Badge>;
};

export default StockBadge;
