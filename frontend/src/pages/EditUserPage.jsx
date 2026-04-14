import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { Button, Input, Select, Card } from '../components/UI';
import { useToast } from '../hooks';
import { staggerContainer, fadeInUp } from '../animations/variants';
import { extractErrorMessage } from '../utils/helpers';

/**
 * Edit user page
 */

export const EditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    status: '',
  });

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userAPI.getUserById(id);
        setUser(response.data.user);
        setFormData({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          role: response.data.user.role,
          status: response.data.user.status,
        });
      } catch (error) {
        addToast(extractErrorMessage(error), 'error');
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await userAPI.updateUser(id, formData);
      addToast('User updated successfully', 'success');
      navigate('/users');
    } catch (error) {
      addToast(extractErrorMessage(error), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-slate-300">Loading user details...</div>;
  }

  const isOwnProfile = currentUser?._id === id;
  const canEditRole = currentUser?.role === 'admin' && !isOwnProfile;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto"
    >
      <motion.div variants={fadeInUp} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Edit User</h1>
        <p className="mt-2 text-slate-300">
          Update user information.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card className="!border-white/10 !bg-slate-900/75 !text-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                tone="dark"
                required
              />

              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                tone="dark"
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              tone="dark"
              required
              disabled={!canEditRole}
            />

            {canEditRole && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  tone="dark"
                  options={[
                    { value: 'user', label: 'User' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'admin', label: 'Admin' },
                  ]}
                />

                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  tone="dark"
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                />
              </div>
            )}

            <div className="flex gap-4 pt-6 border-t border-white/10">
              <Button
                type="button"
                onClick={() => navigate('/users')}
                variant="secondary"
                className="flex-1 !border !border-slate-700 !bg-slate-800 !text-slate-200 hover:!bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                className="flex-1 !rounded-xl !bg-gradient-to-r !from-emerald-400 !to-cyan-400 !text-slate-950"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};
