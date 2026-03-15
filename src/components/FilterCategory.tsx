import { Checkbox, Field, Fieldset, Label, Legend } from "@headlessui/react";
import { CheckIcon } from "@phosphor-icons/react";

type SelectOption = {
  id: number,
  label: string
}

type Props = {
  title: string,
  filters: SelectOption[],
  paramName: string,
  selectedFilters: number[],
  handleChange: (paramName: string, id: number, label: string) => void
}

const FilterCategory = ({title, filters, paramName, selectedFilters, handleChange}: Props) => {
  return (
    <>
      <Fieldset className="space-y-2">
        <Legend className="font-bold">{title}</Legend>
        <div className="space-y-1">
          {filters.map((item: SelectOption) => {
            return (
              <Field key={item.id} className="flex gap-2 checkbox-field">
                <Checkbox className="group checkbox-input"
                  checked={selectedFilters.includes(item.id)}
                  onChange={() => handleChange(paramName, item.id, item.label)}>
                  <CheckIcon size={14} weight="bold" className="hidden group-data-checked:block"/>
                </Checkbox>
                <Label className="checkbox-label">{item.label}</Label>
              </Field>
            )
          })}
        </div>
      </Fieldset>
    </>
  )
}

export default FilterCategory;