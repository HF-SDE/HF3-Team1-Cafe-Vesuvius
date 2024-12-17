import { actionTypes } from "@/reducers/cartReducer";
import { toCamelCase } from "@/utils/camelCase";

import type {
  ActionPayloadMap,
  IAction,
  ICartActions,
} from "@/types/cartReducer.types";

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
