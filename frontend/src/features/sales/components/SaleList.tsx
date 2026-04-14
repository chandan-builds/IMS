import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { Plus, FileText, MessageCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { generateInvoice } from '../utils/generateInvoice';
import { useOrg } from '../../../contexts/OrgContext';

export const SaleList = () => {
  const { organization } = useOrg();
  const { data: response, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data } = await api.get('/sales');
      return data;
    }
  });

  if (isLoading) return <div>Loading sales...</div>;

  const sales = response?.data || [];

  const handleWhatsAppShare = (sale: any) => {
    const text = `Hello from ${organization?.name || 'Our Shop'}!\nHere are your invoice details:\nInvoice Number: ${sale.invoiceNumber}\nDate: ${new Date(sale.saleDate).toLocaleDateString()}\nTotal Amount: ₹${sale.grandTotal || 0}\nThank you for your business!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Sales</h1>
        <Button onClick={() => alert('New Sale Invoice')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sales.map((sale: any) => (
                <tr key={sale._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">
                    {sale.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{sale.grandTotal || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => generateInvoice(sale, organization)} title="Download PDF">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleWhatsAppShare(sale)} title="Share via WhatsApp">
                      <MessageCircle className="h-4 w-4 text-green-500" />
                    </Button>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};