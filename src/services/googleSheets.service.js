import axios from "axios";

const SPREADSHEET_ID =
  "1ShLNlhBe_dh4Cot8ZG4VfNSG9xgMFPACcmslWJx0Irc";

const BASE_URL =
  `https://opensheet.elk.sh/${SPREADSHEET_ID}`;

//
// PRODUCTS
//
export const fetchProducts =
  async () => {
    try {
      const response =
        await axios.get(
          `${BASE_URL}/products`
        );

      return response.data;
    } catch (error) {
      console.error(
        "Products Fetch Error:",
        error
      );

      return [];
    }
  };

//
// TESTIMONIALS
//
export const fetchTestimonials =
  async () => {
    try {
      const response =
        await axios.get(
          `${BASE_URL}/testimonials`
        );

      return response.data;
    } catch (error) {
      console.error(
        "Testimonials Fetch Error:",
        error
      );

      return [];
    }
  };

// DELIVERY CHARGES
export const fetchDeliveryCharges =
  async () => {
    try {
      const response =
        await axios.get(
          `${BASE_URL}/delivery`
        );

      return response.data;
    } catch (error) {
      console.error(
        "Delivery Charges Fetch Error:",
        error
      );

      return [];
    }
  };