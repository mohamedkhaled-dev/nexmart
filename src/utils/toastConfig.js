import toast from 'react-hot-toast';

export const toastStyles = {
  style: {
    background: '#000',
    color: '#fff',
    padding: '16px',
    borderRadius: '999px', 
    fontSize: '14px',
  },
  success: {
    style: {
      background: '#000',
      color: '#fff',
    },
  },
  error: {
    style: {
      background: '#000',
      color: '#fff',
    },
  },
  duration: 1000,

  iconTheme: {
    primary: '#fff',
    secondary: '#000',
  },
};

// Custom toast functions
export const showToast = {
  success: (message) => 
    toast.success(message, {
      ...toastStyles,
      className: 'toast-success',
    }),
    
  error: (message) =>
    toast.error(message, {
      ...toastStyles,
      className: 'toast-error',
    }),
    
  loading: (message) =>
    toast.loading(message, {
      ...toastStyles,
      className: 'toast-loading',
    }),
};