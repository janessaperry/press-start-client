import { useMemo } from "react";
import FilterChip from "./FilterChip.tsx";
import { FilterCategories, SelectOption } from "../types/common.ts";

type Props = {
  filterCategories: FilterCategories;
  committedOrder: string[];
  handleFilterChange: (chipId: string, syncUrl: boolean) => void;
  handleClearAll: () => void;
}

const FilterChipBar = ({ filterCategories, committedOrder, handleFilterChange, handleClearAll }: Props) => {
  const filterChips: SelectOption<string>[] = useMemo(() => {
    const chips = new Set<SelectOption<string>>();

    for (let i = 0; i < committedOrder.length; i++) {
      const currentId = committedOrder[i];
      const [ category, value ] = currentId.split('-');
      const categoryOptions: SelectOption[] | undefined = filterCategories[category as keyof FilterCategories];

      const foundFilter = categoryOptions?.find((option) => option.id === Number(value));
      if (foundFilter) {
        chips.add({ id: committedOrder[i], label: foundFilter.label })
      }
    }
    return [ ...chips ];
  }, [ filterCategories, committedOrder ]);

  return (
    <section className={`grid ${filterChips.length > 0 ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"} transition-[grid-template-rows] duration-250`}>
      <div className="overflow-hidden min-h-0">
        <h3 className="sr-only">Selected Filters</h3>
        <div className="px-4 pt-4 pb-1 bg-blue-500 border border-accent-300/20 rounded-2xl">
          <ul className="flex gap-3 overflow-x-scroll scrollbar-on-dark pb-3 md:flex-wrap md:overflow-x-auto">
            {filterChips.map(filter => (
              <FilterChip key={filter.id}
                chipId={filter.id}
                label={filter.label}
                handleChange={handleFilterChange}/>
            ))}
            <li>
              <button onClick={handleClearAll} className="py-1 px-3 button danger">
                Clear all
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default FilterChipBar;