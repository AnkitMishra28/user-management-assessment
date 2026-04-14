import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { Button, Input, Select, Card } from '../components/UI';
import { useToast } from '../hooks';
import { staggerContainer, fadeInUp } from '../animations/variants';
import { extractErrorMessage } from '../utils/helpers';

/**
 * Create user page (Admin only)
 */

export const CreateUserPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await userAPI.createUser(formData);
      addToast('User created successfully', 'success');
      navigate('/users');
    } catch (error) {
      const errorMsg = extractErrorMessage(error);
      // Try to parse JSON error
      if (errorMsg.includes('{')) {
        try {
          const parsed = JSON.parse(errorMsg);
          setErrors(parsed);
        } catch {
          addToast(errorMsg, 'error');
        }
      } else {
        addToast(errorMsg, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto"
    >
      <motion.div variants={fadeInUp} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Create User</h1>
        <p className="mt-2 text-slate-300">
          Add a new user to your workspace.
        </p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card className="!border-white/10 !bg-slate-900/75 !text-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                tone="dark"
                required
              />

              <Input
                label="Last Name"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                tone="dark"
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              tone="dark"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="At least 8 characters with uppercase, lowercase, number, and special character"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              tone="dark"
              required
            />

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
                Create User
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};
