import { Button, Checkbox, Field, Fieldset, Label, Legend } from "@headlessui/react";
import { CheckIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { SelectedFilters } from "../hooks/useFilterSelections.tsx";

type SelectOption = {
  id: number,
  label: string
}

type Props = {
  title: string,
  showTitle?: boolean,
  description?: string,
  filters: SelectOption[],
  selectedFilters: number[],
  paramName: keyof SelectedFilters,
  handleChange: (id: string) => void
}

const FilterCategory = ({
  title,
  showTitle = true,
  description,
  filters,
  selectedFilters,
  paramName,
  handleChange
}: Props) => {
  const [ showAllFilters, setShowAllFilters ] = useState(false);
  const visibleFilters = filters.slice(0, 5);
  const hiddenFilters = filters.slice(5);

  return (
    <>
      <Fieldset className="space-y-2">
        {showTitle &&
          <Legend className="font-bold flex flex-col">
            {title}
            {description && <span className="text-sm font-normal italic text-secondary-100">{description}</span>}
          </Legend>
        }
        <div className="space-y-1">
          {visibleFilters.map((item: SelectOption, i) => {
            return (
              <Field key={item.id}
                className={`flex gap-2 checkbox-field ${!showAllFilters && i >= 5 ? "max-h-0 overflow-hidden" : "max-h-20"} transition-all duration-1000`}>
                <Checkbox className="group checkbox-input"
                  checked={selectedFilters.includes(item.id)}
                  onChange={() => handleChange(`${paramName}-${item.id}`)}>
                  <CheckIcon size={14} weight="bold" className="hidden group-data-checked:block"/>
                </Checkbox>
                <Label className="checkbox-label">{item.label}</Label>
              </Field>
            )
          })}

          {hiddenFilters.length > 0 &&
            <>
              <div className={`grid ${showAllFilters ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-[grid-template-rows] duration-500 overflow-hidden`}>
                <div className="space-y-1 min-h-0">
                  {hiddenFilters.map(item => {
                    return (
                      <Field key={item.id}
                        className="flex gap-2 checkbox-field">
                        <Checkbox className="group checkbox-input"
                          checked={selectedFilters.includes(item.id)}
                          onChange={() => handleChange(`${paramName}-${item.id}`)}>
                          <CheckIcon size={14} weight="bold" className="hidden group-data-checked:block"/>
                        </Checkbox>
                        <Label className="checkbox-label">{item.label}</Label>
                      </Field>
                    )
                  })}
                </div>
              </div>

              <Button className="link-neutral no-underline"
                onClick={() => setShowAllFilters(!showAllFilters)}>
                {showAllFilters ? 'Show less' : 'Show more'}
              </Button>
            </>
          }
        </div>
      </Fieldset>
    </>
  )
}

export default FilterCategory;