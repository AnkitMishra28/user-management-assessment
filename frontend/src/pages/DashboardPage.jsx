import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { userAPI } from '../services/api';
import { Card, Skeleton } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { staggerContainer, fadeInUp } from '../animations/variants';
import { Users, UserCheck, UserX, Crown, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Dashboard page with statistics
 */

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Only admins can fetch stats
        if (user?.role !== 'admin') {
          setStats(null);
          setLoading(false);
          return;
        }

        const response = await userAPI.getStats();
        setStats(response.data.stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      color: 'from-green-400 to-green-600',
    },
    {
      title: 'Inactive Users',
      value: stats?.inactiveUsers || 0,
      icon: UserX,
      color: 'from-red-400 to-red-600',
    },
    {
      title: 'Administrators',
      value: stats?.admins || 0,
      icon: Crown,
      color: 'from-purple-400 to-purple-600',
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl md:p-8">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" />
          Command Center
        </p>
        <h1 className="text-3xl font-bold text-slate-100 md:text-4xl">
          Welcome back, {user?.firstName}
        </h1>
        <p className="mt-2 text-slate-300">
          Here's your live security and access overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      {user?.role === 'admin' ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton count={3} />
              </div>
            ))
          ) : (
            statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border border-indigo-200/20 bg-gradient-to-b from-slate-900/75 to-indigo-950/40 p-6 shadow-[0_25px_70px_rgba(4,8,24,0.55)]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl text-white shadow-[0_10px_25px_rgba(0,0,0,0.4)]`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <ShieldCheck className="h-5 w-5 text-emerald-300/80" />
                  </div>
                  <h3 className="text-slate-300 text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-slate-100">
                    {stat.value}
                  </p>
                </motion.div>
              );
            })
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={fadeInUp}
          className="rounded-2xl border border-cyan-300/30 bg-gradient-to-r from-slate-900/85 to-cyan-950/60 p-8 text-slate-100"
        >
          <h2 className="mb-2 text-xl font-semibold text-slate-100">
            Your workspace is active
          </h2>
          <p className="text-slate-200/95">
            Signed in as{' '}
            <span className="font-semibold capitalize text-cyan-300">{user?.role}</span>.
            Keep your profile and credentials updated to maintain account security.
          </p>
        </motion.div>
      )}

      {/* Quick actions */}
      <motion.div variants={fadeInUp}>
        <h2 className="text-xl font-bold text-slate-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user?.role === 'admin' && (
            <>
              <Card
                hoverable
                onClick={() => navigate('/users')}
                className="!border-indigo-200/20 !bg-slate-900/70 hover:!bg-indigo-900/40"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-100">Manage Users</h3>
                  <ArrowRight className="h-4 w-4 text-indigo-300" />
                </div>
                <p className="text-sm text-slate-300">View, create, and manage user accounts</p>
              </Card>
              <Card
                hoverable
                onClick={() => navigate('/reports')}
                className="!border-emerald-200/20 !bg-slate-900/70 hover:!bg-emerald-900/30"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-100">View Reports</h3>
                  <ArrowRight className="h-4 w-4 text-emerald-300" />
                </div>
                <p className="text-sm text-slate-300">Access system statistics and reports</p>
              </Card>
            </>
          )}
          <Card
            hoverable
            onClick={() => navigate('/profile')}
            className="!border-cyan-200/20 !bg-slate-900/70 hover:!bg-cyan-900/30"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-slate-100">My Profile</h3>
              <ArrowRight className="h-4 w-4 text-cyan-300" />
            </div>
            <p className="text-sm text-slate-300">Update your personal information</p>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
};
