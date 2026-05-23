import { CONFIG } from "../constants/config";

const parseCharge = (value) => {
  if (value == null) return null;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isNaN(parsed) ? null : parsed;
};

const deliveryCalculator = (
  subtotal,
  pincode,
  rates = []
) => {
  if (pincode) {
    const normalizedPincode = String(pincode).trim();
    const matchedRate = rates.find(
      (rate) => String(rate.pincode).trim() === normalizedPincode
    );

    const rateValue = parseCharge(
      matchedRate?.charge ?? matchedRate?.deliveryCharge ?? matchedRate?.delivery
    );

    if (rateValue != null) {
      return rateValue;
    }
  }

  if (subtotal > CONFIG.freeShippingAmount) {
    return 0;
  }

  return 99;
};

export const calculateDeliveryCharge = (
  subtotal,
  pincode,
  rates = []
) => deliveryCalculator(subtotal, pincode, rates);

export default deliveryCalculator;