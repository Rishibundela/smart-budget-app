import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-6">
            <p className="text-gray-700 dark:text-gray-300">
              You need to be logged in to view your profile.
            </p>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0 flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center">
                    <User className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    Edit Profile
                  </Button>
                  <Button size="sm" variant="outline">
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card title="Account Settings">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-900 dark:text-white text-sm"
                      value={user.name}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-900 dark:text-white text-sm"
                      value={user.email}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  Preferences
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="email-notifications"
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label
                      htmlFor="email-notifications"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Receive email notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="budget-alerts"
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label
                      htmlFor="budget-alerts"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Budget limit alerts
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="monthly-reports"
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="monthly-reports"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Receive monthly reports
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card title="Account Actions">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  Export Data
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Download all your financial data as a CSV file.
                </p>
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Permanently delete your account and all your data.
                </p>
                <Button variant="danger" size="sm">
                  Delete Account
                </Button>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                  Logout
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Sign out from your account.
                </p>
                <Button onClick={logout} size="sm">
                  Logout
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};