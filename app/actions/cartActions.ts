import { IAction, Payload } from "@/reducers/cartReducer";

export function addItem(payload: Payload): IAction {
  return { type: "ADD_TO_CART", payload };
}

export function addInstance(payload: Payload): IAction {
  return { type: "ADD_INSTANCE_TO_CART", payload };
}

export function removeItem(payload: Payload): IAction {
  return { type: "REMOVE_FROM_CART", payload };
}

export function deleteItem(payload: Payload): IAction {
  return { type: "DELETE_FROM_CART", payload };
}

export function updateCartItem(payload: Payload): IAction {
  return { type: "UPDATE_CART_ITEM", payload };
}
