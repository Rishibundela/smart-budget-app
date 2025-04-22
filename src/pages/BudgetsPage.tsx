import React, { useState } from 'react';
import { BudgetList } from '../components/budget/BudgetList';
import { BudgetForm } from '../components/budget/BudgetForm';
import { MonthPicker } from '../components/budget/MonthPicker';
import { Modal } from '../components/ui/Modal';
import { useBudget } from '../context/BudgetContext';
import { useAuth } from '../context/AuthContext';
import { Budget } from '../types';
import { createBudget, deleteBudget, updateBudget } from '../utils/localStorage';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

export const BudgetsPage: React.FC = () => {
  const { user } = useAuth();
  const { transactions, budgets, categories, refreshData } = useBudget();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Set current month and year
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  
  // Go to previous month
  const goToPreviousMonth = () => {
    setMonth(prevMonth => {
      if (prevMonth === 0) {
        setYear(prevYear => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };
  
  // Go to next month
  const goToNextMonth = () => {
    setMonth(prevMonth => {
      if (prevMonth === 11) {
        setYear(prevYear => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };
  
  // Reset to current month
  const resetToCurrentMonth = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };
  
  // Open form modal for adding new budget
  const openAddForm = () => {
    setEditingBudget(null);
    setIsFormOpen(true);
  };
  
  // Open form modal for editing budget
  const openEditForm = (budget: Budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };
  
  // Close form modal
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
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
  const handleSubmitBudget = (budgetData: Omit<Budget, 'id'>) => {
    if (editingBudget) {
      // Update existing budget
      updateBudget({
        ...budgetData,
        id: editingBudget.id,
      });
    } else {
      // Create new budget
      createBudget(budgetData);
    }
    
    refreshData();
    closeForm();
  };
  
  // Handle budget deletion
  const handleDeleteBudget = () => {
    if (confirmDelete) {
      deleteBudget(confirmDelete);
      refreshData();
      closeConfirmDelete();
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Budgets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set and manage your monthly budgets
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button leftIcon={<Plus className="h-5 w-5" />} onClick={openAddForm}>
            Add Budget
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <MonthPicker
          month={month}
          year={year}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
          onReset={resetToCurrentMonth}
        />
        
        <BudgetList
          budgets={budgets}
          categories={categories}
          transactions={transactions}
          onEdit={openEditForm}
          onDelete={openConfirmDelete}
          month={month}
          year={year}
        />
      </div>
      
      {/* Add/Edit Budget Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingBudget ? 'Edit Budget' : 'Add Budget'}
        size="md"
      >
        {user && (
          <BudgetForm
            onSubmit={handleSubmitBudget}
            categories={categories}
            editingBudget={editingBudget}
            userId={user.id}
            month={month}
            year={year}
            existingBudgets={budgets.filter(b => b.month === month && b.year === year)}
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
            Are you sure you want to delete this budget? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="ghost" onClick={closeConfirmDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteBudget}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};