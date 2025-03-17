// ... (existing code)

async function updateSale(id: string, updates: {
  payment_method: string;
  items: Array<{
    productId: string;
    quantity: number;
    priceAtSale: number;
  }>;
}) {
  const updatedSale = await api.sales.update(id, updates);
  await loadSales(); // Force refresh to get updated sale items
  return updatedSale;
}
