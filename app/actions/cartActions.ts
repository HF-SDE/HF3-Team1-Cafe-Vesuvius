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

export type ICartActions<ItemType = any> = {
  [K in keyof ActionPayloadMap]: (
    payload: ActionPayloadMap<ItemType>[K]
  ) => void;
} & {
  getCartItemQuantity: (input: Payload | string) => number;
  getCartItems: (input: Payload | string | undefined) => CartItem[];
};

export function cartActions<ItemType = any>(
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
