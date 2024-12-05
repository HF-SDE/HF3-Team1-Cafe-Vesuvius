import { useReducer } from "react";
import CartReducer, { Payload, CartItem } from "@/reducers/cartReducer";
import {
  addInstance,
  addItem,
  deleteItem,
  removeItem,
  updateCartItem,
} from "@/actions/cartActions";

export default function useCart<T extends Payload = Payload>(
  init: CartItem<T>[] = []
) {
  const [cartItems, dispatch] = useReducer(CartReducer, init);
  function getCartItemQuantity(item: T): number;
  function getCartItemQuantity(id: string): number;
  function getCartItemQuantity(input: T | string): number {
    const id = typeof input === "string" ? input : input.id;

    const cartItems = getCartItems(id);
    if (!cartItems) return 0;

    let quantity = 0;

    for (const item of cartItems) {
      quantity += item.quantity;
    }

    return quantity;
  }

  function getCartItem(item: T): CartItem | undefined;
  function getCartItem(id: string): CartItem | undefined;
  function getCartItem(input: T | string): CartItem | undefined {
    const id = typeof input === "string" ? input : input.id;

    return cartItems.find((item) => item.id === id);
  }

  function getCartItems(item: T): CartItem[] | undefined;
  function getCartItems(id: string): CartItem[] | undefined;
  function getCartItems(input: T | string): CartItem[] | undefined {
    const id = typeof input === "string" ? input : input.id;

    return cartItems.filter((item) => item.id === id);
  }

  const actions = {
    addItem: (item: Payload) => dispatch(addItem(item)),
    removeItem: (item: Payload) => dispatch(removeItem(item)),
    addInstance: (item: Payload) => dispatch(addInstance(item)),
    deleteItem: (item: Payload) => dispatch(deleteItem(item)),
    updateCartItem: (item: Payload) => dispatch(updateCartItem(item)),
    getCartItemQuantity,
    getCartItem,
    getCartItems,
  };

  return [cartItems, actions] as [CartItem<T>[], typeof actions];
}
