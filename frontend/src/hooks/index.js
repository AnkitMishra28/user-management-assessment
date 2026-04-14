import { useState, useCallback, useEffect } from 'react';

/**
 * useToast Hook
 * Manage toast notifications
 */

export const useToast = () => {
  const [toasts, setToasts] = useState(globalToasts);

  useEffect(() => {
    const listener = (nextToasts) => {
      setToasts(nextToasts);
    };

    toastListeners.add(listener);
    return () => {
      toastListeners.delete(listener);
    };
  }, []);

  const removeToast = useCallback((id) => {
    globalToasts = globalToasts.filter((toast) => toast.id !== id);
    notifyToastListeners();
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const newToast = { id, message, type };

    globalToasts = [...globalToasts, newToast];
    notifyToastListeners();

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  return { toasts, addToast, removeToast };
};

let globalToasts = [];
const toastListeners = new Set();

const notifyToastListeners = () => {
  toastListeners.forEach((listener) => listener(globalToasts));
};

/**
 * useLoading Hook
 * Manage loading states
 */

export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  return { isLoading, startLoading, stopLoading };
};

/**
 * usePagination Hook
 * Manage pagination states
 */

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const goToPrevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  return {
    page,
    limit,
    total,
    setTotal,
    totalPages,
    goToPage,
    goToNextPage,
    goToPrevPage,
    setLimit,
  };
};

/**
 * useModal Hook
 * Manage modal open/close states
 */

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
};
