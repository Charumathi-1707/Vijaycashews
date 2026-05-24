import axios from "./axios";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwM8l_Q0p_k91Cgf07wTzhe2NQ_hPo6omynvCGxn5ECxK2nssoNGpEXZAOIcgJsPJQL/exec";

const buildFormBody = (payload) => {
  const params = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    params.append(key, String(value ?? ""));
  });
  return params.toString();
};

export const postAppsScriptAction = async (action, payload = {}) => {
  try {
    const body = buildFormBody({ action, ...payload });

    const response = await axios.post(
      GOOGLE_SCRIPT_URL,
      body,
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded;charset=UTF-8",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Apps Script ${action} Error:`, error);
    throw error;
  }
};
