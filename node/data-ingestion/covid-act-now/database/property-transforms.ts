import { toSnake, toCamel } from "convert-keys";
import { SnakeCasedPropertiesDeep, CamelCasedPropertiesDeep } from "type-fest";

export function snakeCaseProperties<T extends object>(items: T[]): SnakeCasedPropertiesDeep<T>[] {
  return items.map(toSnake<SnakeCasedPropertiesDeep<T>>);
}

export function camelCaseProperties<T extends object>(items: T[]): CamelCasedPropertiesDeep<T>[] {
  return items.map(toCamel<CamelCasedPropertiesDeep<T>>);
}
