import React, { useState } from 'react';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { DateRangeFilter } from '../components/transactions/DateRangeFilter';
import { Modal } from '../components/ui/Modal';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { Transaction } from '../types';
import { createTransaction, deleteTransaction, updateTransaction } from '../utils/localStorage';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const { transactions, categories, filterOptions, setFilterOptions, refreshData } = useBudget();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Open form modal for adding new transaction
  const openAddForm = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };
  
  // Open form modal for editing transaction
  const openEditForm = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };
  
  // Close form modal
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };
  
  // Open confirm delete modal
  const openConfirmDelete = (id: string) => {
    setConfirmDelete(id);
  };
  
  // Close confirm delete modal
  const closeConfirmDelete = () => {
    setConfirmDelete(null);
  };
  
  // Handle form submission
  const handleSubmitTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      // Update existing transaction
      updateTransaction({
        ...transactionData,
        id: editingTransaction.id,
      });
    } else {
      // Create new transaction
      createTransaction(transactionData);
    }
    
    refreshData();
    closeForm();
  };
  
  // Handle transaction deletion
  const handleDeleteTransaction = () => {
    if (confirmDelete) {
      deleteTransaction(confirmDelete);
      refreshData();
      closeConfirmDelete();
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your income and expenses
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button leftIcon={<Plus className="h-5 w-5" />} onClick={openAddForm}>
            Add Transaction
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <DateRangeFilter
          dateRange={filterOptions.dateRange}
          onChange={(dateRange) => setFilterOptions({ ...filterOptions, dateRange })}
        />
        
        <TransactionList
          transactions={transactions}
          categories={categories}
          dateRange={filterOptions.dateRange}
          onEdit={openEditForm}
          onDelete={openConfirmDelete}
        />
      </div>
      
      {/* Add/Edit Transaction Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        size="lg"
      >
        {user && (
          <TransactionForm
            onSubmit={handleSubmitTransaction}
            categories={categories}
            editingTransaction={editingTransaction}
            userId={user.id}
          />
        )}
      </Modal>
      
      {/* Confirm Delete Modal */}
      <Modal
        isOpen={confirmDelete !== null}
        onClose={closeConfirmDelete}
        title="Confirm Delete"
        size="sm"
      >
        <div className="py-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this transaction? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="ghost" onClick={closeConfirmDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteTransaction}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};