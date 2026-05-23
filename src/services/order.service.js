export const placeOrder = async (
  orderData
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        "Order placed:",
        orderData
      );

      resolve({
        success: true,
      });
    }, 1000);
  });
};