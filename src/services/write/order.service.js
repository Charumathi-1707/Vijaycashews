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

export const assignDeliveryPerson = async (
  orderId,
  deliveryPerson
) => {
  return postAppsScriptAction("assignDeliveryPerson", {
    orderId,
    assignedTo: deliveryPerson,
  });
};
