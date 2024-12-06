import { useReducer } from "react";
import CartReducer, { Payload, CartItem } from "@/reducers/cartReducer";
import { cartActions, ICartActions } from "@/actions/cartActions";

export default function useCart<T extends Payload = Payload>(
  init: CartItem<T>[] = []
) {
  const [cartItems, dispatch] = useReducer(CartReducer, init);

  function getCartItemQuantity(input: T | string): number {
    const cartItems = getCartItems(input);
    if (!cartItems) return 0;

    let quantity = 0;

    for (const item of cartItems) {
      quantity += item.quantity;
    }

    return quantity;
  }

  function getCartItems(input: T | string | undefined): CartItem[] {
    if (!input) return [];
    const id = typeof input === "string" ? input : input.id;

    return cartItems.filter((item) => item.id === id);
  }

  const actions = cartActions(dispatch);

  actions.getCartItemQuantity = getCartItemQuantity;
  actions.getCartItems = getCartItems;

  return [cartItems, actions] as [CartItem<T>[], ICartActions<T>];
}
