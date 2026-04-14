import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (sale: any, orgDetails?: any) => {
  const doc = new jsPDF();
  
  // Organization Details
  doc.setFontSize(18);
  doc.text(orgDetails?.name || 'My Shop', 14, 22);
  
  doc.setFontSize(10);
  if (orgDetails?.address) {
    doc.text(`${orgDetails.address.street || ''} ${orgDetails.address.city || ''}`, 14, 30);
    doc.text(`${orgDetails.address.state || ''} ${orgDetails.address.zipCode || ''}`, 14, 35);
  }
  if (orgDetails?.phone) {
    doc.text(`Phone: ${orgDetails.phone}`, 14, 40);
  }

  // Invoice Details
  doc.setFontSize(14);
  doc.text('INVOICE', 140, 22);
  
  doc.setFontSize(10);
  doc.text(`Invoice Number: ${sale.invoiceNumber || 'N/A'}`, 140, 30);
  doc.text(`Date: ${new Date(sale.saleDate).toLocaleDateString()}`, 140, 35);
  if (sale.paymentStatus) {
    doc.text(`Payment Status: ${sale.paymentStatus.toUpperCase()}`, 140, 40);
  }

  // Customer Details (if B2B or present)
  let startY = 55;
  if (sale.customerId && sale.customerId.name) {
    doc.text(`Bill To: ${sale.customerId.name}`, 14, startY);
    if (sale.customerId.phone) doc.text(`Phone: ${sale.customerId.phone}`, 14, startY + 5);
    startY += 15;
  } else {
    doc.text('Bill To: Walk-in Customer', 14, startY);
    startY += 10;
  }

  // Items Table
  const tableData = (sale.items || []).map((item: any, index: number) => [
    index + 1,
    item.productName || 'Unknown Product',
    `${item.quantity} ${item.unit || ''}`,
    `₹${item.salePrice?.toFixed(2) || 0}`,
    `₹${item.taxAmount?.toFixed(2) || 0}`,
    `₹${item.total?.toFixed(2) || 0}`
  ]);

  autoTable(doc, {
    startY: startY,
    head: [['#', 'Item', 'Qty', 'Rate', 'Tax', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }, // primary indigo-600
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY || startY + 20;
  
  doc.setFontSize(10);
  doc.text(`Subtotal:`, 140, finalY + 10);
  doc.text(`₹${sale.subtotal?.toFixed(2) || 0}`, 180, finalY + 10, { align: 'right' });
  
  doc.text(`Tax Total:`, 140, finalY + 15);
  doc.text(`₹${sale.taxTotal?.toFixed(2) || 0}`, 180, finalY + 15, { align: 'right' });

  if (sale.discountTotal > 0) {
    doc.text(`Discount:`, 140, finalY + 20);
    doc.text(`-₹${sale.discountTotal?.toFixed(2)}`, 180, finalY + 20, { align: 'right' });
  }

  doc.setFontSize(12);
  doc.text(`Grand Total:`, 140, finalY + 28);
  doc.text(`₹${sale.grandTotal?.toFixed(2) || 0}`, 180, finalY + 28, { align: 'right' });

  // Footer Notes
  doc.setFontSize(9);
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });

  doc.save(`Invoice_${sale.invoiceNumber || 'Unknown'}.pdf`);
};