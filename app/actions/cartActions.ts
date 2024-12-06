import {
  Payload,
  CartItem,
  IAction,
  actionTypes,
} from "@/reducers/cartReducer";
import { toCamelCase, ToCamelCase } from "@/utils/camelCase";

type ActionPayloadMap<T = any> = {
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

export function cartActions<ItemType>(
  dispatch: React.Dispatch<IAction<ItemType>>
): ICartActions<ItemType> {
  const actions = {} as ICartActions<ItemType>;

  for (const type of actionTypes) {
    const actionType: keyof ActionPayloadMap =
      toCamelCase<IAction<ItemType>["type"]>(type);

    actions[actionType] = (payload) =>
      dispatch({ type, payload } as IAction<ItemType>);
  }

  return actions;
}
