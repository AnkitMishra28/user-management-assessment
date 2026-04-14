import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { Button, Input, Card } from '../components/UI';
import { useToast } from '../hooks';
import { staggerContainer, fadeInUp } from '../animations/variants';
import { extractErrorMessage, formatDate } from '../utils/helpers';

/**
 * User profile page
 */

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'security'
  const [editingInfo, setEditingInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Info form
  const [infoData, setInfoData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handle info change
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfoData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit info update
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await authAPI.updateProfile(infoData);
      updateUser(response.data.user);
      addToast('Profile saved. If you updated your email, use the new one the next time you sign in.', 'success');
      setEditingInfo(false);
    } catch (error) {
      addToast(extractErrorMessage(error), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit password change
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setSubmitting(true);

    try {
      await authAPI.changePassword(
        passwordData.oldPassword,
        passwordData.newPassword
      );
      addToast('Password updated. Please sign in again with the new password next time.', 'success');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      addToast(extractErrorMessage(error), 'error');
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
      {/* Header */}
      <motion.div variants={fadeInUp} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">My Profile</h1>
        <p className="mt-2 text-slate-300">Review and update your account settings.</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        variants={fadeInUp}
        className="mb-8 rounded-2xl border border-white/10 bg-slate-900/75 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white shadow-[0_18px_40px_rgba(59,130,246,0.35)]">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-slate-300">{user?.email}</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-block rounded-full bg-blue-500/15 px-3 py-1 text-sm font-semibold capitalize text-blue-300">
                {user?.role}
              </span>
              <span className="inline-block rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold capitalize text-emerald-300">
                {user?.status}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeInUp} className="mb-6 flex gap-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'info'
              ? 'border-b-cyan-400 text-cyan-300'
              : 'border-b-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-b-cyan-400 text-cyan-300'
              : 'border-b-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Security
        </button>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <motion.div variants={fadeInUp}>
          {!editingInfo ? (
            <Card className="!border-white/10 !bg-slate-900/75 !text-slate-100">
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-slate-400">First Name</p>
                  <p className="text-lg font-semibold text-slate-100">
                    {user?.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Last Name</p>
                  <p className="text-lg font-semibold text-slate-100">
                    {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-lg font-semibold text-slate-100">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Member Since</p>
                  <p className="text-lg font-semibold text-slate-100">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setEditingInfo(true)}
                variant="primary"
                className="!rounded-xl !bg-gradient-to-r !from-emerald-400 !to-cyan-400 !text-slate-950"
              >
                Edit Profile
              </Button>
            </Card>
          ) : (
            <Card className="!border-white/10 !bg-slate-900/75 !text-slate-100">
              <form onSubmit={handleUpdateInfo} className="space-y-6">
                <Input
                  label="First Name"
                  name="firstName"
                  value={infoData.firstName}
                  onChange={handleInfoChange}
                  tone="dark"
                  required
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={infoData.lastName}
                  onChange={handleInfoChange}
                  tone="dark"
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={infoData.email}
                  onChange={handleInfoChange}
                  tone="dark"
                  required
                />

                <div className="flex gap-4 pt-6 border-t border-white/10">
                  <Button
                    type="button"
                    onClick={() => setEditingInfo(false)}
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
          )}
        </motion.div>
      )}

      {activeTab === 'security' && (
        <motion.div variants={fadeInUp}>
          <Card className="!border-white/10 !bg-slate-900/75 !text-slate-100">
            <form onSubmit={handleChangePassword} className="space-y-6">
              <Input
                label="Current Password"
                type="password"
                name="oldPassword"
                placeholder="Enter your current password"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                tone="dark"
                required
              />

              <Input
                label="New Password"
                type="password"
                name="newPassword"
                placeholder="At least 8 characters with uppercase, lowercase, number, and special character"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                tone="dark"
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your new password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                tone="dark"
                required
              />

              <div className="flex gap-4 pt-6 border-t border-white/10">
                <Button
                  type="button"
                  onClick={() =>
                    setPasswordData({
                      oldPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    })
                  }
                  variant="secondary"
                  className="flex-1 !border !border-slate-700 !bg-slate-800 !text-slate-200 hover:!bg-slate-700"
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  className="flex-1 !rounded-xl !bg-gradient-to-r !from-emerald-400 !to-cyan-400 !text-slate-950"
                >
                  Change Password
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};
