import axios from "./axios";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbweLzw4-cAyLHfl8VSGT9hS3LF6vRwWBhcVo5FNkSC4jCEHi5oAhXlz4E4fwVQ_Kz9ckg/exec";

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
