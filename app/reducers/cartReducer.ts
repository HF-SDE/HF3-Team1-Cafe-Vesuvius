type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface CartItem<T = any> {
  id: string;
  cartItemId?: string;
  quantity: number;
  item?: T;
  note?: string;
}

export interface Payload extends Optional<CartItem, "quantity"> {}

type ActionTypes =
  | "ADD_TO_CART"
  | "REMOVE_FROM_CART"
  | "ADD_INSTANCE_TO_CART"
  | "DELETE_FROM_CART"
  | "UPDATE_CART_ITEM";

export interface IAction {
  type: ActionTypes;
  payload: Payload;
}

let increment = 1;

export default function CartReducer<T>(state: CartItem<T>[], action: IAction) {
  let existingCartItem = state.find(
    (item) => item.cartItemId === action.payload.cartItemId
  );

  const quantity = action.payload?.quantity || 1;

  switch (action.type) {
    case "ADD_TO_CART":
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        return [...state];
      }
    case "ADD_INSTANCE_TO_CART":
      return [
        ...state,
        {
          id: action.payload.id,
          cartItemId: action.payload.id + "_" + increment++,
          quantity: quantity,
          item: action.payload.item,
        },
      ];

    case "REMOVE_FROM_CART":
      if (existingCartItem) {
        if (existingCartItem.quantity === quantity) {
          return state.filter(
            (item) => item.cartItemId !== action.payload.cartItemId
          );
        } else {
          existingCartItem.quantity -= quantity;
          return [...state];
        }
      }

    case "DELETE_FROM_CART":
      return state.filter(
        (item) => item.cartItemId !== action.payload.cartItemId
      );

    case "UPDATE_CART_ITEM":
      if (existingCartItem) {
        existingCartItem = {
          ...existingCartItem,
          ...action.payload,
        };

        state = [...state].map((item) =>
          item.cartItemId === action.payload.cartItemId
            ? existingCartItem!
            : item
        );

        return state;
      }

    default:
      return state;
  }
}
