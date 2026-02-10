import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 border border-white/5',
    secondary: 'bg-slate-800 text-white hover:bg-slate-700 border border-white/5',
    outline: 'border border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white',
    ghost: 'text-slate-400 hover:bg-white/5 hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-10 py-4 text-sm',
    xl: 'px-12 py-6 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;