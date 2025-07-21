
export type FieldType = "string" | "number" | "nested"

export interface Field {
  id: string
  parentId: string | null
  key: string
  type: FieldType | null
}
