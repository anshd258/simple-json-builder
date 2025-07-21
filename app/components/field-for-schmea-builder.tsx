"use client"
import { FC } from "react";
import { Input } from "./ui/input";
import { Button} from "./ui/button";
import { Trash2, Plus } from "lucide-react";
import { Select , SelectTrigger, SelectValue, SelectContent, SelectItem} from "./ui/select";
import { Field, FieldType } from "../types/fiels-type";
interface IFieldsRendererProps {
    fields :any[]
    parentId :string | null 
    depth :number | null
    updateField : (id: string, updates: Partial<Field>) => void
    addField : (id: string) => void
    deleteField : (id: string) => void
};

export const FieldsRenderer: FC<IFieldsRendererProps> = (props) => {

        const levelFields = props.fields.filter(f => f.parentId === props.parentId)
    
        return levelFields.map(field => (
          <div key={field.id} style={{ marginLeft: `${props.depth ?? 0 * 20}px` }}>
            <div className="flex items-center gap-2 mb-2 ">
              <Input
                placeholder="Field name"
                value={field.key}
                onChange={(e) => props.updateField(field.id, { key: e.target.value })}
                className="flex-1"
              />
              <Select
                value={field.type}
                onValueChange={(value) => props.updateField(field.id, { type: value as FieldType })}
              >
                <SelectTrigger className="w-40 ">
                  <SelectValue placeholder="Select Type" color="white"  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="nested">Nested</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => props.deleteField(field.id)}
              >
                <Trash2 className="h-4 w-4 stroke-white "  />
              </Button>
            </div>
            {field.type === "nested" && field.key && (
              <div className="ml-4 pl-4 border-l-2 border-gray-200">
                <FieldsRenderer fields={props.fields} parentId={field.id} depth={props.depth ?? 0 + 1} updateField={props.updateField} addField={props.addField} deleteField={props.deleteField} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => props.addField(field.id)}
                  className="mb-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add nested field
                </Button>
              </div>
            )}
          </div>
        ));

}