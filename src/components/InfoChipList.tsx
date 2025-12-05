import InfoChip from "./InfoChip.tsx";
import { ComponentPropsWithoutRef } from "react";

type Props = {
  data: {
    id: number,
    label: string
  }[]
} & ComponentPropsWithoutRef<'article'>;

const InfoChipList = ({data}: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {data.map((item) => {
        return <InfoChip key={item.id} label={item.label}/>
      })}
    </div>
  )
}

export default InfoChipList;