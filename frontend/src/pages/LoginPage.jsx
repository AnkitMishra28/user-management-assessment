import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fadeInUp, staggerContainer } from '../animations/variants';
import { useToast } from '../hooks';
import { extractErrorMessage } from '../utils/helpers';
import { Shield, KeyRound, Sparkles, Lock } from 'lucide-react';

/**
 * Login page
 */

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        addToast('Login successful!', 'success');
        navigate('/dashboard');
      } else {
        addToast(result.error || 'Login failed', 'error');
      }
    } catch (error) {
      addToast(extractErrorMessage(error), 'error');
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    {
      title: 'Identity shielding',
      description:
        'Protect workforce identities and sensitive records with encrypted boundaries and secure defaults.',
      icon: Shield,
    },
    {
      title: 'Policy-driven permissions',
      description:
        'Control who can view, edit, and approve actions with role scopes built for real teams.',
      icon: KeyRound,
    },
    {
      title: 'Audit-ready governance',
      description:
        'Track privilege changes and account activity with timeline-first audit intelligence.',
      icon: Lock,
    },
  ];

  return (
    <div className="security-bg min-h-screen px-4 py-12 md:px-8">
      <div className="security-stars" />
      <div className="security-meteor" />
      <div className="security-meteor delay-2" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-6xl"
      >
        <motion.div
          variants={fadeInUp}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              Identity Operations
            </p>
            <h1 className="security-title max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
              Secure every account before risk appears
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-300 md:text-lg">
              Built for modern teams that need fast onboarding, strict access boundaries, and complete accountability.
            </p>
          </div>
          <span className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-slate-200 shadow-[0_0_40px_rgba(80,130,255,0.2)] md:block">
            Compliance Hub
          </span>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="security-card rounded-3xl p-6"
              >
                <div className="mb-4 inline-flex rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-3 text-emerald-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mb-3 text-xl font-semibold text-slate-100">{item.title}</h2>
                <p className="text-sm leading-relaxed text-slate-300">{item.description}</p>
                <div className="mt-8 h-28 rounded-2xl bg-gradient-to-t from-indigo-300/20 to-transparent blur-[1px]" />
              </motion.article>
            );
          })}
        </motion.div>

        <motion.section
          variants={fadeInUp}
          className="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/70 p-7 shadow-[0_25px_120px_rgba(0,0,0,0.6)] backdrop-blur-xl md:p-9"
        >
          <h3 className="text-3xl font-semibold text-slate-100">Welcome back</h3>
          <p className="mt-2 text-sm text-slate-400">Sign in to continue to your dashboard</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400/70 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400/70 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-base font-semibold text-slate-950 shadow-[0_10px_35px_rgba(16,185,129,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </form>

          <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-500/5 p-4 text-xs text-cyan-100">
            <p className="mb-2 font-semibold uppercase tracking-[0.12em] text-cyan-300">Demo credentials</p>
            <p>Admin: admin@test.com / Admin@123456789</p>
            <p>Manager: manager@test.com / Manager@123456789</p>
            <p>User: ankit@test.com / Ankit@12345678</p>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};
