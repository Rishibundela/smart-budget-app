import { jsPDF } from 'jspdf';
import { Transaction, Category, User } from '../types';
import { formatCurrency, formatFullDate, formatMonth } from './formatters';

export const exportTransactionsAsPdf = (
  transactions: Transaction[],
  categories: Category[],
  user: User,
  month: number,
  year: number
): void => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Add title
  doc.setFontSize(18);
  doc.text(`Monthly Finance Report - ${formatMonth(month, year)}`, 20, 20);
  doc.setFontSize(12);
  doc.text(`Generated for: ${user.name}`, 20, 30);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 37);

  // Add summary
  doc.setFontSize(14);
  doc.text('Summary', 20, 50);
  doc.setFontSize(12);
  
  // Calculate income and expenses
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = income - expenses;
  
  doc.text(`Total Income: ${formatCurrency(income)}`, 25, 60);
  doc.text(`Total Expenses: ${formatCurrency(expenses)}`, 25, 67);
  doc.text(`Net Balance: ${formatCurrency(balance)}`, 25, 74);
  
  // Add transaction list
  doc.setFontSize(14);
  doc.text('Transaction List', 20, 90);
  doc.setFontSize(10);
  
  // Table header
  doc.text('Date', 20, 100);
  doc.text('Category', 50, 100);
  doc.text('Description', 90, 100);
  doc.text('Amount', 170, 100);
  
  // Table rows
  let y = 110;
  const getCategoryName = (id: string) => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : 'Unknown';
  };
  
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  transactions.forEach((transaction, index) => {
    if (y > 270) {
      // Add new page if reaching the bottom
      doc.addPage();
      y = 20;
      
      // Add header to new page
      doc.setFontSize(10);
      doc.text('Date', 20, y);
      doc.text('Category', 50, y);
      doc.text('Description', 90, y);
      doc.text('Amount', 170, y);
      y += 10;
    }
    
    doc.text(formatFullDate(transaction.date), 20, y);
    doc.text(getCategoryName(transaction.categoryId), 50, y);
    
    // Truncate description if too long
    const description = transaction.description.length > 35 
      ? transaction.description.substring(0, 32) + '...' 
      : transaction.description;
    doc.text(description, 90, y);
    
    // Format amount with color based on type
    const formattedAmount = transaction.type === 'income' 
      ? `+${formatCurrency(transaction.amount)}` 
      : `-${formatCurrency(transaction.amount)}`;
    doc.text(formattedAmount, 170, y);
    
    y += 7;
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount} - Smart Budget App`, 100, 290, { align: 'center' });
  }
  
  // Save PDF
  doc.save(`smart-budget-report-${year}-${month + 1}.pdf`);
};