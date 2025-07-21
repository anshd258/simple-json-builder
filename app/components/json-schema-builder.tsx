"use client"

import React, { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import {  Plus } from "lucide-react"
import { FieldsRenderer } from "./field-for-schmea-builder"
import { Field, } from "../types/fiels-type";

export function JsonSchemaBuilder() {
  const [fields, setFields] = useState<Field[]>([])

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const addField = (parentId: string | null = null) => {
    const newField: Field = {
      id: generateId(),
      parentId,
      key: "",
      type: "string",
    }
    setFields([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  const deleteField = (id: string) => {
    const getDescendantIds = (parentId: string): string[] => {
      const children = fields.filter(f => f.parentId === parentId)
      const descendantIds = [parentId]
      children.forEach(child => {
        descendantIds.push(...getDescendantIds(child.id))
      })
      return descendantIds
    }

    const idsToDelete = getDescendantIds(id)
    setFields(fields.filter(field => !idsToDelete.includes(field.id)))
  }

  const buildJsonSchema = (): any => {
    
    const builderJson = (parentId: string | null) : any =>{
    const levelFields = fields.filter(f => f.parentId === parentId)
    const result: any = {}

    levelFields.forEach(field => {
      if (!field.key) return

      if (field.type === "string") {
        result[field.key] = "STRING"
      } else if (field.type === "number") {
        result[field.key] = "NUMBER"
      } else if (field.type === "nested") {
        result[field.key] = builderJson(field.id)
      }
    })
return result
  }

    return builderJson(null)
  }



  const jsonSchema = buildJsonSchema()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>JSON Schema Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FieldsRenderer
              fields={fields}
              parentId={null}
              depth={null}
              updateField={(id, updates) => {
                updateField(id, updates)
              }} addField={(id) => {
                addField(id)
              }} deleteField={(id) => {
                deleteField(id)
              }} />
            <Button onClick={() => addField(null)} className="w-full">
              <Plus className="h-4 w-4 mr-1" />
              Add field
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JSON Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto ">
            {JSON.stringify(jsonSchema, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}