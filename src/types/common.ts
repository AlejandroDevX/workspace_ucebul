export type EntityId = number | string

export interface SelectOption<TValue extends string | number = string> {
  label: string
  value: TValue
}
