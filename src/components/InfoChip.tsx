import { ComponentPropsWithoutRef } from "react";

type Props = {
  label: string
} & ComponentPropsWithoutRef<'p'>;

const InfoChip = ({label}: Props) => {
  return (
    <p className="py-1 px-2 text-base leading-none text-grey-50 border border-primary-300 rounded-full"
    >
      {label}
    </p>
  )
}

export default InfoChip;