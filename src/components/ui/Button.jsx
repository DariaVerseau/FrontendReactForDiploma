import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export default function Button({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = '',
  ...props 
}) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  className: PropTypes.string
};