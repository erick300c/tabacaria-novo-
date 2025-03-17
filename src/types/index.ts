export interface Product {
  id: string;
  name: string;
  category: 'beverages' | 'tobacco' | 'accessories';
  subcategory: string;
  barcode: string;
  cost_price: number;
  selling_price: number;
  quantity: number;
  supplier: string;
  min_stock_level: number;
  unit: 'unit' | 'liter' | 'gram';
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  total: number;
  payment_method: 'card' | 'cash' | 'pix';
  created_at: string;
  sale_items: Array<{
    quantity: number;
    price_at_sale: number;
    products: {
      name: string;
    };
  }>;
}

export interface DashboardStats {
  total_sales: number;
  total_revenue: number;
  low_stock_items: number;
  top_products: {
    product_id: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
}
