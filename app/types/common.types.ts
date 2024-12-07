export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ToCamelCase<S extends string> =
  S extends `${infer First}_${infer Rest}`
    ? `${Lowercase<First>}${Capitalize<ToCamelCase<Rest>>}`
    : Lowercase<S>;
