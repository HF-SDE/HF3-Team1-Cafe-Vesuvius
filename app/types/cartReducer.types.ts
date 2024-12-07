import { Optional, ToCamelCase } from "./common.types";

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

export interface AddItemPayload<ItemType>
  extends Optional<Omit<AddInstancePayload<ItemType>, "id">, "item"> {
  id?: string;
  cartItemId?: string;
}

export interface RemoveItemPayload extends Payload {
  quantity?: number;
}

export interface AddInstancePayload<ItemType>
  extends Omit<Payload<ItemType>, "cartItemId"> {
  id: string;
  item: ItemType;
  quantity?: number;
}

export interface DeleteInstancePayload extends Omit<Payload, "id"> {
  cartItemId?: string;
}

export interface UpdateItemPayload extends Payload {
  note: string;
}

export type IAction<ItemType = any> =
  | { type: "ADD_ITEM"; payload: AddItemPayload<ItemType> }
  | { type: "REMOVE_ITEM"; payload: RemoveItemPayload }
  | { type: "ADD_INSTANCE"; payload: AddInstancePayload<ItemType> }
  | { type: "DELETE_INSTANCE"; payload: DeleteInstancePayload }
  | { type: "UPDATE_ITEM"; payload: UpdateItemPayload };

export type ActionPayloadMap<T = any> = {
  [Action in IAction<T> as ToCamelCase<Action["type"]>]: Action["payload"];
};

export type ICartActions<ItemType> = {
  [K in keyof ActionPayloadMap]: (
    payload: ActionPayloadMap<ItemType>[K]
  ) => void;
} & {
  getCartItemQuantity: (input: ItemType | string) => number;
  getCartItems: (input: ItemType | string | undefined) => CartItem[];
};
