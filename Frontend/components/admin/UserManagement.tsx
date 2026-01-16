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
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  TrendingUp,
  DollarSign,
  Star,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { AdminUser } from '@/services/adminService';

const UserManagement = () => {
  const { users, isLoading, error, getAllUsers, deactivateUser, deleteUser, clearError } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleToggleUserStatus = async (userId: string, userName: string, isActive: boolean) => {
    const action = isActive ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} ${userName}?`)) {
      return;
    }

    setActionLoading(userId);
    try {
      await deactivateUser(userId);
      alert(`User ${userName} has been ${action}d successfully`);
    } catch (err: any) {
      alert(err.message || `Failed to ${action} user`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`⚠️ WARNING: Are you sure you want to PERMANENTLY DELETE ${userName}? This action cannot be undone!`)) {
      return;
    }

    const confirmDelete = prompt(`Type "${userName}" to confirm deletion:`);
    if (confirmDelete !== userName) {
      alert('Deletion cancelled - name did not match');
      return;
    }

    setActionLoading(userId);
    try {
      await deleteUser(userId);
      alert(`User ${userName} has been deleted successfully`);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
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
          <RefreshCw className="w-16 h-16 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-900 font-semibold text-lg">Loading users...</p>
          <p className="text-gray-600 text-sm mt-2">Please wait while we fetch user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-700 font-medium">Manage platform users and their permissions</p>
          </div>
          <button 
            onClick={getAllUsers}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 shadow-lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Refresh Users
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-900 font-semibold">{error}</span>
            </div>
            <button onClick={clearError} className="text-red-600 hover:text-red-800">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name, email, username, or phone..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 font-medium text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-5 py-3 rounded-lg flex items-center gap-2 transition-all font-bold ${
                  selectedFilter === filter.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>{filter.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                  selectedFilter === filter.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Grid - Mobile Responsive */}
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                User Information
              </th>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Contact Details
              </th>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Statistics
              </th>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Status
              </th>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user: AdminUser) => (
              <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-base">{user.name}</div>
                      <div className="text-sm text-gray-600 font-medium">@{user.username}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-5 px-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{user.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{user.location || 'Not specified'}</span>
                    </div>
                  </div>
                </td>

                <td className="py-5 px-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold text-gray-900">{user.totalExchanges} Exchanges</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-bold text-gray-900">KSh {user.totalIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-gray-900">{user.ratings}/5.0</span>
                    </div>
                  </div>
                </td>

                <td className="py-5 px-6">
                  <div className="flex items-center gap-2">
                    {user.isActive ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="px-3 py-1.5 text-sm font-bold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="px-3 py-1.5 text-sm font-bold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      </>
                    )}
                  </div>
                </td>

                <td className="py-5 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleToggleUserStatus(user._id || user.id, user.name, user.isActive)}
                      disabled={actionLoading === (user._id || user.id)}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                        user.isActive 
                          ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50' 
                          : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                      }`}
                      title={user.isActive ? 'Deactivate User' : 'Activate User'}
                    >
                      {actionLoading === (user._id || user.id) ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : user.isActive ? (
                        <UserX className="w-5 h-5" />
                      ) : (
                        <UserCheck className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteUser(user._id || user.id, user.name)}
                      disabled={actionLoading === (user._id || user.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete User"
                    >
                      {actionLoading === (user._id || user.id) ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {filteredUsers.map((user: AdminUser) => (
          <div key={user._id || user.id} className="p-4 hover:bg-gray-50 transition-colors">
            {/* User Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-base truncate">{user.name}</div>
                <div className="text-sm text-gray-600 font-medium truncate">@{user.username}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
              {/* Status Badge */}
              <div className="flex-shrink-0">
                {user.isActive ? (
                  <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900 truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900">{user.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900 truncate">{user.location || 'Not specified'}</span>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-green-50 p-2 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                </div>
                <div className="text-sm font-bold text-gray-900">{user.totalExchanges}</div>
                <div className="text-xs text-gray-600">Exchanges</div>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="w-3 h-3 text-blue-600" />
                </div>
                <div className="text-xs font-bold text-gray-900">KSh {(user.totalIncome / 1000).toFixed(1)}K</div>
                <div className="text-xs text-gray-600">Income</div>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-sm font-bold text-gray-900">{user.ratings}</div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleViewDetails(user)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View
              </button>

              <button
                onClick={() => handleToggleUserStatus(user._id || user.id, user.name, user.isActive)}
                disabled={actionLoading === (user._id || user.id)}
                className={`flex-1 px-3 py-2 font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                  user.isActive 
                    ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {actionLoading === (user._id || user.id) ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : user.isActive ? (
                  <>
                    <UserX className="w-4 h-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Activate
                  </>
                )}
              </button>

              <button
                onClick={() => handleDeleteUser(user._id || user.id, user.name)}
                disabled={actionLoading === (user._id || user.id)}
                className="p-2 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
                title="Delete User"
              >
                {actionLoading === (user._id || user.id) ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-gray-50">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserX className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-700 font-medium mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-5 bg-white rounded-lg shadow-md border-2 border-gray-200">
            <div className="text-2xl font-black text-gray-900">{users.length}</div>
            <div className="text-sm text-gray-700 font-bold mt-1">Total Users</div>
          </div>
          <div className="text-center p-5 bg-white rounded-lg shadow-md border-2 border-green-200">
            <div className="text-2xl font-black text-green-600">
              {users.filter(u => u.isActive).length}
            </div>
            <div className="text-sm text-gray-700 font-bold mt-1">Active Users</div>
          </div>
          <div className="text-center p-5 bg-white rounded-lg shadow-md border-2 border-blue-200">
            <div className="text-2xl font-black text-blue-600">
              {users.reduce((sum, u) => sum + u.totalExchanges, 0)}
            </div>
            <div className="text-sm text-gray-700 font-bold mt-1">Total Exchanges</div>
          </div>
          <div className="text-center p-5 bg-white rounded-lg shadow-md border-2 border-purple-200">
            <div className="text-2xl font-black text-purple-600">
              KSh {users.reduce((sum, u) => sum + u.totalIncome, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-700 font-bold mt-1">Total Income</div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-gray-700 font-medium">@{selectedUser.username}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Member since {new Date(selectedUser.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <h5 className="font-bold text-gray-900 mb-3 text-lg">Contact Information</h5>
                <div className="space-y-2">
                  <p className="text-gray-900 font-medium"><span className="text-gray-600">Email:</span> {selectedUser.email}</p>
                  <p className="text-gray-900 font-medium"><span className="text-gray-600">Phone:</span> {selectedUser.phoneNumber}</p>
                  <p className="text-gray-900 font-medium"><span className="text-gray-600">Location:</span> {selectedUser.location || 'Not specified'}</p>
                  <p className="text-gray-900 font-medium"><span className="text-gray-600">Role:</span> {selectedUser.role}</p>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <h5 className="font-bold text-gray-900 mb-3 text-lg">Statistics</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Total Exchanges</p>
                    <p className="text-2xl font-black text-gray-900">{selectedUser.totalExchanges}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Total Income</p>
                    <p className="text-2xl font-black text-gray-900">KSh {selectedUser.totalIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Rating</p>
                    <p className="text-2xl font-black text-gray-900">{selectedUser.ratings}/5.0</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className={`text-2xl font-black ${selectedUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;