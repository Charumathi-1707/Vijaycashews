const PageWrapper = ({ children }) => {
  return (
    <div className="overflow-hidden">
      {children}
    </div>
  );
};

export default PageWrapper;