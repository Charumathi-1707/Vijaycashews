import { postAppsScriptAction } from "../api/appsScript";

export const saveWishlist = async (email, items) => {
  return postAppsScriptAction("saveWishlist", {
    email,
    items: JSON.stringify(items),
  });
};
