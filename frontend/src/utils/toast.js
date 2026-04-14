/**
 * Toast notification system
 * Simple, non-invasive feedback messages
 */

let toastId = 0;
let toastCallback = null;

export const setToastCallback = (callback) => {
  toastCallback = callback;
};

export const showToast = (message, type = 'info', duration = 3000) => {
  const id = ++toastId;

  if (toastCallback) {
    toastCallback({
      id,
      message,
      type, // 'info', 'success', 'error', 'warning'
      duration,
    });
  }

  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
};

export const removeToast = (id) => {
  if (toastCallback) {
    toastCallback((prev) => prev.filter((t) => t.id !== id));
  }
};

export const toast = {
  success: (message, duration = 3000) =>
    showToast(message, 'success', duration),
  error: (message, duration = 4000) =>
    showToast(message, 'error', duration),
  info: (message, duration = 3000) =>
    showToast(message, 'info', duration),
  warning: (message, duration = 3500) =>
    showToast(message, 'warning', duration),
};
