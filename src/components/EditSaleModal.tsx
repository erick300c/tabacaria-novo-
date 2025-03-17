import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Save } from 'lucide-react';
import { api } from '../lib/api';
import { Sale } from '../types';

interface EditSaleModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditSaleModal: React.FC<EditSaleModalProps> = ({ sale, isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [items, setItems] = useState<Array<{ productId: string; quantity: number; priceAtSale: number }>>([]);

  useEffect(() => {
    if (sale) {
      setPaymentMethod(sale.payment_method);
      setItems(sale.sale_items.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        priceAtSale: item.price_at_sale
      })));
    }
  }, [sale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sale) return;

    try {
      await api.sales.update(sale.id, {
        payment_method: paymentMethod,
        items: items
      });
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating sale:', error);
    }
  };

  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('sales.editSale')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('common.paymentMethod')}
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="cash">{t('sales.paymentMethods.cash')}</option>
              <option value="card">{t('sales.paymentMethods.card')}</option>
              <option value="pix">{t('sales.paymentMethods.pix')}</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">{t('common.items')}</h3>
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].quantity = Number(e.target.value);
                    setItems(newItems);
                  }}
                  className="p-2 border rounded-md w-20"
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.priceAtSale}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].priceAtSale = Number(e.target.value);
                    setItems(newItems);
                  }}
                  className="p-2 border rounded-md flex-1"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSaleModal;
