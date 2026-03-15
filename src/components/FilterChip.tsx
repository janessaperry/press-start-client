import { XIcon } from "@phosphor-icons/react";
import { ComponentProps } from "react";

type Props = {
  category: string,
  chipId: number,
  label: string,
  handleChange: (paramName: string, id: number, label: string) => void
} & ComponentProps<'li'>;

const FilterChip = ({category, chipId, label, handleChange}: Props) => {
  return (
    <li id={`${category}-${chipId}`}
      className="py-1 pl-3 pr-1 flex items-center gap-1 text-primary border border-primary-300 rounded-full">
      {label}
      <button onClick={() => handleChange(category, chipId, label)}
        className="p-1 hover:bg-danger-500 hover:text-danger-50 focus-visible:outline-2 focus-visible:outline-danger-500 rounded-full">
        <XIcon/>
      </button>
    </li>
  )
}

export default FilterChip;