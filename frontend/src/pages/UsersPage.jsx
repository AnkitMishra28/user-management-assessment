import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Select, Skeleton, Badge, Modal } from '../components/UI';
import { useToast, usePagination, useModal } from '../hooks';
import { staggerContainer, fadeInUp } from '../animations/variants';
import { formatDate, extractErrorMessage } from '../utils/helpers';
import { Trash2, Edit2, Plus, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Users list page with table, search, filters, and pagination
 */

export const UsersPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();
  const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
  });
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const pagination = usePagination(1, 10);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const filterParams = {
          ...filters,
          ...(searchTerm && { search: searchTerm }),
        };

        const response = await userAPI.getAllUsers(
          pagination.page,
          pagination.limit,
          filterParams
        );

        setUsers(response.data.users);
        pagination.setTotal(response.data.pagination.total);
      } catch (error) {
        addToast(extractErrorMessage(error), 'error');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pagination.page, pagination.limit, filters, searchTerm]);

  // Handle delete
  const handleDeleteClick = (userRecord) => {
    setUserToDelete(userRecord);
    openDelete();
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await userAPI.deleteUser(userToDelete._id);
      addToast('User deleted successfully', 'success');
      closeDelete();
      setUserToDelete(null);
      // Refresh list
      setUsers(users.filter((u) => u._id !== userToDelete._id));
    } catch (error) {
      addToast(extractErrorMessage(error), 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const canManageUsers = ['admin', 'manager'].includes(currentUser?.role);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_25px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            Access Directory
          </p>
          <h1 className="text-3xl font-bold text-slate-100">Users</h1>
          <p className="mt-1 text-sm text-slate-300">Manage identities, roles, and account status.</p>
        </div>
        {currentUser?.role === 'admin' && (
          <Button
            onClick={() => navigate('/users/create')}
            variant="primary"
            className="flex items-center gap-2 !rounded-xl !bg-gradient-to-r !from-emerald-400 !to-cyan-400 !text-slate-950 !shadow-[0_10px_35px_rgba(16,185,129,0.35)]"
          >
            <Plus className="w-4 h-4" />
            Create User
          </Button>
        )}
      </motion.div>

      {/* Search and Filters */}
      {canManageUsers && (
        <motion.div variants={fadeInUp} className="rounded-2xl border border-indigo-200/20 bg-slate-900/70 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  pagination.goToPage(1);
                }}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/70 py-2 pl-10 pr-4 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400/70 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
              />
            </div>

            <Select
              value={filters.role}
              onChange={(e) => {
                setFilters({ ...filters, role: e.target.value });
                pagination.goToPage(1);
              }}
              options={[
                { value: '', label: 'All Roles' },
                { value: 'admin', label: 'Admin' },
                { value: 'manager', label: 'Manager' },
                { value: 'user', label: 'User' },
              ]}
            />

            <Select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                pagination.goToPage(1);
              }}
              options={[
                { value: '', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />

            <Button
              onClick={() => {
                setSearchTerm('');
                setFilters({ role: '', status: '' });
                pagination.goToPage(1);
              }}
              variant="secondary"
              className="!border !border-slate-600 !bg-slate-800 !text-slate-200 hover:!bg-slate-700"
            >
              Reset
            </Button>
          </div>
        </motion.div>
      )}

      {/* Users Table */}
      <motion.div variants={fadeInUp} className="overflow-hidden rounded-2xl border border-indigo-200/20 bg-slate-900/70 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-700 bg-slate-800/70">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <Skeleton />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((userRecord) => (
                  <motion.tr
                    key={userRecord._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="transition-colors hover:bg-slate-800/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-bold text-slate-950 shadow-[0_8px_20px_rgba(16,185,129,0.35)]">
                          {userRecord.firstName[0]}
                          {userRecord.lastName[0]}
                        </div>
                        <span className="font-medium text-slate-100">
                          {userRecord.firstName} {userRecord.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{userRecord.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant={userRecord.role}>
                        {userRecord.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={userRecord.status === 'active' ? 'success' : 'default'}>
                        {userRecord.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {formatDate(userRecord.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => navigate(`/users/${userRecord._id}`)}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {currentUser?.role === 'admin' && (
                          <Button
                            onClick={() => handleDeleteClick(userRecord)}
                            variant="danger"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-700 bg-slate-800/60 px-6 py-4">
            <p className="text-sm text-slate-300">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <Button
                onClick={pagination.goToPrevPage}
                disabled={pagination.page === 1}
                variant="secondary"
                size="sm"
                className="!border !border-slate-600 !bg-slate-800 !text-slate-200 hover:!bg-slate-700"
              >
                Previous
              </Button>
              <Button
                onClick={pagination.goToNextPage}
                disabled={pagination.page === pagination.totalPages}
                variant="secondary"
                size="sm"
                className="!border !border-slate-600 !bg-slate-800 !text-slate-200 hover:!bg-slate-700"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        title="Delete User"
        actions={
          <>
            <Button onClick={closeDelete} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} variant="danger" loading={deleteLoading} className="flex-1">
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{userToDelete?.firstName} {userToDelete?.lastName}</span>?
          This action will mark the user as inactive.
        </p>
      </Modal>
    </motion.div>
  );
};
