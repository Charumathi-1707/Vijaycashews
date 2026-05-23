import axios from "axios";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwM8l_Q0p_k91Cgf07wTzhe2NQ_hPo6omynvCGxn5ECxK2nssoNGpEXZAOIcgJsPJQL/exec";

export const saveOrder =
  async (orderData) => {

    try {

      // CREATE URL-ENCODED PAYLOAD FOR Google Apps Script
      const params = new URLSearchParams();

      Object.entries(orderData).forEach(
        ([key, value]) => {
          params.append(key, String(value ?? ""));
        }
      );

      const response =
        await axios.post(
          GOOGLE_SCRIPT_URL,
          params.toString(),
          {
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded;charset=UTF-8",
            },
          }
        );

      return response.data;

    } catch (error) {

      console.error(
        "Save Order Error:",
        error
      );

      throw error;
    }
  };