import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Category, Transaction } from '../../types';
import { Calendar, DollarSign, Archive, Plus } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
  categories: Category[];
  editingTransaction: Transaction | null;
  userId: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  categories,
  editingTransaction,
  userId,
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Fill form with transaction data when editing
  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount.toString());
      setDescription(editingTransaction.description);
      setDate(new Date(editingTransaction.date).toISOString().split('T')[0]);
      setCategoryId(editingTransaction.categoryId);
      setType(editingTransaction.type);
    } else {
      // Reset form on component mount or when editingTransaction becomes null
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategoryId('');
      setType('expense');
    }
  }, [editingTransaction]);
  
  // Filter categories based on transaction type
  const filteredCategories = categories.filter(category => {
    if (type === 'income') {
      return category.name === 'Income';
    }
    return category.name !== 'Income';
  });
  
  // Set default category when type changes
  useEffect(() => {
    if (filteredCategories.length > 0 && !filteredCategories.find(cat => cat.id === categoryId)) {
      setCategoryId(filteredCategories[0].id);
    }
  }, [type, filteredCategories, categoryId]);
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    
    if (!description) {
      newErrors.description = 'Description is required';
    }
    
    if (!date) {
      newErrors.date = 'Date is required';
    }
    
    if (!categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit({
      amount: parseFloat(amount),
      description,
      date: new Date(date).toISOString(),
      categoryId,
      type,
      userId,
    });
    
    // Reset form if not editing
    if (!editingTransaction) {
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  };
  
  return (
    <Card title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label="Transaction Type"
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
              options={[
                { value: 'expense', label: 'Expense' },
                { value: 'income', label: 'Income' },
              ]}
            />
          </div>
          
          <div>
            <Input
              type="number"
              label="Amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              leftIcon={<DollarSign className="h-5 w-5 text-gray-400" />}
              error={errors.amount}
              required
            />
          </div>
        </div>
        
        <Input
          type="text"
          label="Description"
          placeholder="What was this transaction for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              leftIcon={<Calendar className="h-5 w-5 text-gray-400" />}
              error={errors.date}
              required
            />
          </div>
          
          <div>
            <Select
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={filteredCategories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              error={errors.categoryId}
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            leftIcon={editingTransaction ? <Archive /> : <Plus />}
          >
            {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Card>
  );
};