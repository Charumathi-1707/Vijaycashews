const generateOrderId = () => {
  const timestamp = Date.now();

  const random = Math.floor(
    Math.random() * 1000
  );

  return `VC-${timestamp}-${random}`;
};

export default generateOrderId;