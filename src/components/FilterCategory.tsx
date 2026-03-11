import { Checkbox, Field, Label } from "@headlessui/react";
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
  handleChange: (paramName: string, id: number) => void
}

const FilterCategory = ({title, filters, paramName, selectedFilters, handleChange}: Props) => {
  return (
    <>
      <div className="space-y-2">
        <h3>{title}</h3>
        <div className="space-y-1">
          {filters.map((item: SelectOption) => {
            return (
              <Field key={item.id} className="flex gap-2 checkbox-field">
                <Checkbox className="group checkbox-input"
                  checked={selectedFilters.includes(item.id)}
                  onChange={() => handleChange(paramName, item.id)}>
                  <CheckIcon size={14} weight="bold" className="hidden group-data-checked:block"/>
                </Checkbox>
                <Label className="checkbox-label">{item.label}</Label>
              </Field>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default FilterCategory;