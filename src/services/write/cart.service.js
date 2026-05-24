import { postAppsScriptAction } from "../api/appsScript";

export const saveCart = async (email, items) => {
  return postAppsScriptAction("saveCart", {
    email,
    items: JSON.stringify(items),
  });
};
