type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface CartItem<ItemType = any> {
  id?: string;
  cartItemId?: string;
  quantity: number;
  item: ItemType;
  note?: string;
}

export interface Payload<_T = any> {
  id?: string;
  cartItemId?: string;
}

interface AddItemPayload<ItemType>
  extends Optional<Omit<AddInstancePayload<ItemType>, "id">, "item"> {
  id?: string;
  cartItemId?: string;
}
interface RemoveItemPayload extends Payload {
  quantity?: number;
}
interface AddInstancePayload<ItemType>
  extends Omit<Payload<ItemType>, "cartItemId"> {
  id: string;
  item: ItemType;
  quantity?: number;
}
interface DeleteInstancePayload extends Omit<Payload, "id"> {
  cartItemId?: string;
}
interface UpdateItemPayload extends Payload {
  note: string;
}

export type IAction<ItemType = any> =
  | { type: "ADD_ITEM"; payload: AddItemPayload<ItemType> }
  | { type: "REMOVE_ITEM"; payload: RemoveItemPayload }
  | { type: "ADD_INSTANCE"; payload: AddInstancePayload<ItemType> }
  | { type: "DELETE_INSTANCE"; payload: DeleteInstancePayload }
  | { type: "UPDATE_ITEM"; payload: UpdateItemPayload };

export const actionTypes: IAction["type"][] = [
  "ADD_ITEM",
  "REMOVE_ITEM",
  "ADD_INSTANCE",
  "DELETE_INSTANCE",
  "UPDATE_ITEM",
];

let increment = 1;

export default function CartReducer<T>(state: CartItem<T>[], action: IAction) {
  const { payload, type } = action;
  const defaultQuantity = 1;

  const id = "id" in payload ? payload.id : "";
  const cartItemId = "cartItemId" in payload ? payload.cartItemId : "";

  let quantity = defaultQuantity;
  if ("quantity" in payload) quantity = payload.quantity || defaultQuantity;

  let cartInstance = state.find((item) => item.cartItemId === cartItemId);

  let firstCartItem = state.find((item) => item.id === id);

  switch (type) {
    case "ADD_ITEM":
      if (cartInstance) {
        cartInstance.quantity += quantity;
        return [...state];
      } else if (firstCartItem) {
        firstCartItem.quantity += quantity;
        return [...state];
      }
    case "ADD_INSTANCE":
      return [
        ...state,
        {
          id: id,
          cartItemId: id + "_" + increment++,
          quantity: quantity,
          item: action.payload.item || {},
        },
      ];

    case "REMOVE_ITEM":
      if (cartInstance) {
        if (cartInstance.quantity !== quantity) {
          cartInstance.quantity -= quantity;
          return [...state];
        }
      }

    case "DELETE_INSTANCE":
      return state.filter((item) => item.cartItemId !== cartItemId);

    case "UPDATE_ITEM":
      if (cartInstance) {
        const newInstance = {
          ...cartInstance,
          ...action.payload,
        };

        state = [...state].map((item) =>
          item.cartItemId === cartItemId ? newInstance : item
        );

        return state;
      }

    default:
      return state;
  }
}
