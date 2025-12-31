/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Mail,
  Phone,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  TrendingUp,
  DollarSign,
  Star
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { AdminUser } from '@/services/adminService';

const UserManagement = () => {
  const { users, isLoading, error, getAllUsers, deactivateUser, clearError } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleDeactivateUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to deactivate ${userName}?`)) {
      return;
    }

    setActionLoading(userId);
    try {
      await deactivateUser(userId);
      alert(`User ${userName} has been deactivated successfully`);
    } catch (err: any) {
      alert(err.message || 'Failed to deactivate user');
    } finally {
      setActionLoading(null);
    }
  };

  const filters = [
    { id: 'all', label: 'All Users', count: users.length },
    { id: 'active', label: 'Active', count: users.filter(u => u.isActive).length },
    { id: 'inactive', label: 'Inactive', count: users.filter(u => !u.isActive).length },
  ];

  const filteredUsers = users.filter(user => {
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'active' && !user.isActive) return false;
      if (selectedFilter === 'inactive' && user.isActive) return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.phoneNumber.includes(query)
      );
    }
    
    return true;
  });

  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage platform users and their permissions</p>
          </div>
          <button 
            onClick={getAllUsers}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Users'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
            <button onClick={clearError} className="text-red-600 hover:text-red-800">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>{filter.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  selectedFilter === filter.id
                    ? 'bg-white/20'
                    : 'bg-gray-100'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stats
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user: AdminUser) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{user.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{user.location || 'N/A'}</span>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">{user.totalExchanges} Exchanges</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">KSh {user.totalIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium">{user.ratings}/5.0</span>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {user.isActive ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      </>
                    )}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {user.isActive ? (
                      <button
                        onClick={() => handleDeactivateUser(user.id, user.name)}
                        disabled={actionLoading === user.id}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Deactivate User"
                      >
                        {actionLoading === user.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <UserX className="w-4 h-4" />
                        )}
                      </button>
                    ) : (
                      <button
                        className="p-2 text-gray-400 cursor-not-allowed"
                        title="User Inactive"
                        disabled
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserX className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Summary */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">{users.length}</div>
            <div className="text-xs text-gray-600">Total Users</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {users.filter(u => u.isActive).length}
            </div>
            <div className="text-xs text-gray-600">Active Users</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {users.reduce((sum, u) => sum + u.totalExchanges, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Exchanges</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              KSh {users.reduce((sum, u) => sum + u.totalIncome, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Income</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;