import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Users, UserCheck, UserX, Shield, Briefcase, User } from 'lucide-react';
import { userAPI } from '../services/api';
import { Card, Skeleton } from '../components/UI';
import { staggerContainer, fadeInUp } from '../animations/variants';

/**
 * Reports page (Admin only)
 */
export const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await userAPI.getStats();
        setStats(response.data.stats);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = useMemo(
    () => [
      { title: 'Total Users', key: 'totalUsers', icon: Users, color: 'text-blue-300' },
      { title: 'Active Users', key: 'activeUsers', icon: UserCheck, color: 'text-emerald-300' },
      { title: 'Inactive Users', key: 'inactiveUsers', icon: UserX, color: 'text-rose-300' },
      { title: 'Admins', key: 'admins', icon: Shield, color: 'text-cyan-300' },
      { title: 'Managers', key: 'managers', icon: Briefcase, color: 'text-amber-300' },
      { title: 'Users', key: 'users', icon: User, color: 'text-violet-300' },
    ],
    []
  );

  const activeRatio = stats?.totalUsers
    ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
    : 0;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto space-y-8"
    >
      <motion.div variants={fadeInUp} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
        <h1 className="text-3xl font-bold text-slate-100">Reports</h1>
        <p className="mt-2 text-slate-300">System-level user metrics and role distribution overview.</p>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="!border-white/10 !bg-slate-900/75">
                <Skeleton count={2} />
              </Card>
            ))
          : cards.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.key}
                  className="!border-white/10 !bg-slate-900/75 !text-slate-100"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-300">{item.title}</p>
                      <p className="mt-1 text-3xl font-bold text-slate-100">{stats?.[item.key] ?? 0}</p>
                    </div>
                    <Icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                </Card>
              );
            })}
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card className="!border-white/10 !bg-slate-900/75 !text-slate-100">
          <h2 className="text-lg font-semibold text-slate-100">Account Activity Health</h2>
          <p className="mt-1 text-sm text-slate-300">
            {activeRatio}% of accounts are currently active.
          </p>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-700/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
              style={{ width: `${activeRatio}%` }}
            />
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
