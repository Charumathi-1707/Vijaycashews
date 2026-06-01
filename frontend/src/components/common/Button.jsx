const Button = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`rounded-full bg-yellow-700 px-6 py-3 font-semibold text-white transition hover:bg-yellow-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;