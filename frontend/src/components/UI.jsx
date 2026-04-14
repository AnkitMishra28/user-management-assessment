import { motion } from 'framer-motion';
import { fadeInUp } from '../animations/variants';

/**
 * Button component with variants
 */

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400',
    secondary:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-300',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-400',
    ghost:
      'text-gray-600 hover:bg-gray-100 focus:ring-gray-500 disabled:text-gray-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

/**
 * Input component
 */

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  tone = 'light',
  ...props
}) => {
  const isDark = tone === 'dark';

  return (
    <div className="space-y-1">
      {label && (
        <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
          isDark
            ? 'border border-slate-700 bg-slate-800/80 text-slate-100 placeholder:text-slate-500 focus:ring-cyan-400'
            : 'border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-blue-500'
        } ${error ? (isDark ? 'border-red-400 focus:ring-red-400' : 'border-red-500 focus:ring-red-500') : ''} ${disabled ? (isDark ? 'bg-slate-800 cursor-not-allowed' : 'bg-gray-100 cursor-not-allowed') : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-500'}`}>{error}</p>
      )}
    </div>
  );
};

/**
 * Select component
 */

export const Select = ({
  label,
  value,
  onChange,
  options = [],
  error,
  disabled = false,
  className = '',
  tone = 'light',
  ...props
}) => {
  const isDark = tone === 'dark';

  return (
    <div className="space-y-1">
      {label && (
        <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg px-4 py-2 transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
          isDark
            ? 'border border-slate-700 bg-slate-800/80 text-slate-100 focus:ring-cyan-400'
            : 'border border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
        } ${error ? (isDark ? 'border-red-400 focus:ring-red-400' : 'border-red-500 focus:ring-red-500') : ''} ${disabled ? (isDark ? 'bg-slate-800 cursor-not-allowed' : 'bg-gray-100 cursor-not-allowed') : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-500'}`}>{error}</p>
      )}
    </div>
  );
};

/**
 * Card component
 */

export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${
        hoverable ? 'hover:shadow-md hover:border-gray-200 cursor-pointer transition-all' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Badge component
 */

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-blue-100 text-blue-800',
    user: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
        variants[variant]
      } ${className}`}
    >
      {children}
    </span>
  );
};

/**
 * Loading skeleton
 */

export const Skeleton = ({ count = 1, height = 'h-4', className = '' }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse ${className}`}
        />
      ))}
    </div>
  );
};

/**
 * Modal component
 */

export const Modal = ({ isOpen, onClose, title, children, actions = null }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {title && (
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
          )}
          <div>{children}</div>
          {actions && (
            <div className="flex gap-3 mt-6">
              {actions}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
