import { postAppsScriptAction } from "../api/appsScript";

export const saveOrder = async (orderData) => {
  return postAppsScriptAction("saveOrder", orderData);
};

export const updateOrderStatus = async (orderId, status) => {
  return postAppsScriptAction("updateOrderStatus", {
    orderId,
    status,
  });
};
