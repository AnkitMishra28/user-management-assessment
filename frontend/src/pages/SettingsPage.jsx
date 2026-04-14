import { motion } from 'framer-motion';
import { Bell, Moon, Globe, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card } from '../components/UI';
import { staggerContainer, fadeInUp } from '../animations/variants';
import { useToast } from '../hooks';

/**
 * Settings page
 */

export const SettingsPage = () => {
  const { addToast } = useToast();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    loginAlerts: true,
    activityUpdates: false,
    compactView: false,
    highContrast: false,
    reduceAnimations: false,
    twoFactorReminder: false,
    sessionVisibility: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('ums.settings.preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences((prev) => ({ ...prev, ...parsed }));
      } catch {
        // Ignore invalid saved payloads and keep defaults
      }
    }
  }, []);

  const togglePreference = (key, label) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('ums.settings.preferences', JSON.stringify(next));
      return next;
    });

    addToast(`${label} preference updated`, 'success', 1800);
  };

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      description: 'Control when and how alerts reach you.',
      items: [
        { key: 'emailNotifications', label: 'Email notifications', info: 'Receive account and security updates by email.' },
        { key: 'loginAlerts', label: 'Login alerts', info: 'Get notified when a new sign-in is detected.' },
        { key: 'activityUpdates', label: 'User activity updates', info: 'Receive digest summaries of team activity.' },
      ],
    },
    {
      title: 'Appearance',
      icon: Moon,
      description: 'Adjust UI density and visual behavior.',
      items: [
        { key: 'compactView', label: 'Compact view', info: 'Reduce spacing for higher information density.' },
      ],
    },
    {
      title: 'Accessibility',
      icon: Globe,
      description: 'Improve readability and interaction comfort.',
      items: [
        { key: 'highContrast', label: 'High contrast', info: 'Increase contrast for improved visibility.' },
        { key: 'reduceAnimations', label: 'Reduce animations', info: 'Minimize motion effects across the app.' },
      ],
    },
    {
      title: 'Security',
      icon: Lock,
      description: 'Fine-tune account safety preferences.',
      items: [
        { key: 'twoFactorReminder', label: 'Two-factor setup reminder', info: 'Show reminders to complete 2FA setup.' },
        { key: 'sessionVisibility', label: 'Login session visibility', info: 'Display current active session details.' },
      ],
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto"
    >
      <motion.div variants={fadeInUp} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Settings</h1>
        <p className="mt-2 text-slate-300">
          Manage your preferences and account settings.
        </p>
      </motion.div>

      <motion.div variants={staggerContainer} className="space-y-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div key={section.title} variants={fadeInUp}>
              <Card className="!border-white/10 !bg-slate-900/75 !text-slate-100 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="rounded-lg bg-cyan-400/15 p-3 text-cyan-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">
                      {section.title}
                    </h2>
                    <p className="text-sm text-slate-300">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {section.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/55 p-3"
                    >
                      <div>
                        <p className="font-medium text-slate-100">
                          {item.label}
                        </p>
                        {item.info && (
                          <p className="mt-1 text-xs text-slate-400">
                            {item.info}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePreference(item.key, item.label)}
                        aria-label={`Toggle ${item.label}`}
                        className={`h-7 w-12 rounded-full p-0.5 transition-colors ${
                          preferences[item.key] ? 'bg-cyan-400' : 'bg-slate-600'
                        }`}
                      >
                        <div
                          className={`h-6 w-6 rounded-full bg-white transition-transform ${
                            preferences[item.key] ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
