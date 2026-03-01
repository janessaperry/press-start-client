import InfoChip from "./InfoChip.tsx";
import { ComponentPropsWithoutRef } from "react";

type Props = {
  data: {
    id: number,
    label: string,
  }[],
  variant?: "primary" | "secondary",
  size?: "xs" | "sm" | "md"
} & ComponentPropsWithoutRef<'article'>;

const InfoChipList = ({data, variant = "primary", size = "md"}: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {data.map((item) => {
        return <InfoChip key={item.id} label={item.label} variant={variant} size={size}/>
      })}
    </div>
  )
}

export default InfoChipList;