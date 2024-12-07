import { ToCamelCase } from "@/types/common.types";

export function toCamelCase<T extends string>(input: string): ToCamelCase<T> {
  return input
    .toLowerCase()
    .split("_")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("") as ToCamelCase<T>;
}
