import { useEffect } from "react";

const Toast = ({
  message,
  show,
  setShow,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-10 left-1/2 z-[999] -translate-x-1/2 rounded-full bg-green-600 px-8 py-4 font-semibold text-white shadow-2xl">

      {message}
    </div>
  );
};

export default Toast;