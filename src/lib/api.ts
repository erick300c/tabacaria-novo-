// ... (existing code)

sales: {
  async update(id: string, updates: {
    payment_method: string;
    items: Array<{
      productId: string;
      quantity: number;
      priceAtSale: number;
    }>;
  }) {
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .update({
        payment_method: updates.payment_method,
        total: updates.items.reduce((sum, item) => sum + (item.quantity * item.priceAtSale), 0)
      })
      .eq('id', id)
      .select()
      .single();

    if (saleError) throw saleError;

    // Delete existing sale items
    const { error: deleteError } = await supabase
      .from('sale_items')
      .delete()
      .eq('sale_id', id);

    if (deleteError) throw deleteError;

    // Insert new sale items
    const saleItems = updates.items.map(item => ({
      sale_id: id,
      product_id: item.productId,
      quantity: item.quantity,
      price_at_sale: item.priceAtSale
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);

    if (itemsError) throw itemsError;

    return saleData;
  },
  // ... (rest of sales methods)
}
