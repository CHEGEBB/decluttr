'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Mail,
  Phone,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Eye
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  status: 'Active' | 'Suspended' | 'Pending';
  verified: boolean;
  totalListings: number;
  totalSales: number;
  rating: number;
}

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+254 712 345 678',
      location: 'Nairobi',
      joinDate: '2024-01-15',
      status: 'Active',
      verified: true,
      totalListings: 24,
      totalSales: 12,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+254 723 456 789',
      location: 'Mombasa',
      joinDate: '2024-02-20',
      status: 'Active',
      verified: true,
      totalListings: 18,
      totalSales: 8,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+254 734 567 890',
      location: 'Kisumu',
      joinDate: '2024-03-10',
      status: 'Suspended',
      verified: false,
      totalListings: 5,
      totalSales: 0,
      rating: 3.2
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      phone: '+254 745 678 901',
      location: 'Nairobi',
      joinDate: '2024-04-05',
      status: 'Pending',
      verified: false,
      totalListings: 0,
      totalSales: 0,
      rating: 0
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david@example.com',
      phone: '+254 756 789 012',
      location: 'Eldoret',
      joinDate: '2024-05-12',
      status: 'Active',
      verified: true,
      totalListings: 32,
      totalSales: 15,
      rating: 4.7
    }
  ];

  const filters = [
    { id: 'all', label: 'All Users', count: users.length },
    { id: 'active', label: 'Active', count: users.filter(u => u.status === 'Active').length },
    { id: 'suspended', label: 'Suspended', count: users.filter(u => u.status === 'Suspended').length },
    { id: 'pending', label: 'Pending', count: users.filter(u => u.status === 'Pending').length },
    { id: 'verified', label: 'Verified', count: users.filter(u => u.verified).length }
  ];

  const filteredUsers = users.filter(user => {
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'verified') {
        if (!user.verified) return false;
      } else if (user.status.toLowerCase() !== selectedFilter) {
        return false;
      }
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query)
      );
    }
    
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Suspended':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Pending':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Suspended':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUserAction = (userId: number, action: string) => {
    console.log(`${action} user ${userId}`);
    // Implement user action logic
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage platform users and their permissions</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all">
              + Add Admin User
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
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

          {/* Filters */}
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
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                {/* User Column */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact Info Column */}
                <td className="py-4 px-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {user.location}
                    </div>
                  </div>
                </td>

                {/* Stats Column */}
                <td className="py-4 px-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{user.totalListings}</div>
                      <div className="text-xs text-gray-500">Listings</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{user.totalSales}</div>
                      <div className="text-xs text-gray-500">Sales</div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(user.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </div>
                        ))}
                        <span className="text-sm text-gray-600 ml-1">({user.rating})</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status Column */}
                <td className="py-4 px-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(user.status)}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.verified ? (
                        <>
                          <Shield className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600">Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-600">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                </td>

                {/* Actions Column */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUserAction(user.id, 'view')}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUserAction(user.id, 'edit')}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {user.status === 'Active' ? (
                      <button
                        onClick={() => handleUserAction(user.id, 'suspend')}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Suspend User"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUserAction(user.id, 'activate')}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Activate User"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
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
              {users.filter(u => u.status === 'Active').length}
            </div>
            <div className="text-xs text-gray-600">Active Users</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {users.filter(u => u.verified).length}
            </div>
            <div className="text-xs text-gray-600">Verified Users</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {users.reduce((sum, user) => sum + user.totalListings, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Listings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;