import { postAppsScriptAction } from "../api/appsScript";

export const saveUser = async (userData) => {
  return postAppsScriptAction("saveUser", userData);
};
