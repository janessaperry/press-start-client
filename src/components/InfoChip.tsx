import { ComponentPropsWithoutRef } from "react";

type Props = {
  label: string,
  variant?: "primary" | "secondary",
  size?: "sm" | "md"
} & ComponentPropsWithoutRef<'p'>;

const InfoChip = ({label, variant = "primary", size = "md"}: Props) => {
  const variantStyleMap = {
    "primary": "",
    "secondary": "bg-blue-500"
  }

  const sizeStyleMap = {
    "sm": "py-1 px-2 text-base",
    "md": "py-2 px-3 text-lg"
  }

  return (
    <p className={`leading-none text-grey-50 border border-primary-300 rounded-full ${sizeStyleMap[size]} ${variantStyleMap[variant]}`}
    >
      {label}
    </p>
  )
}

export default InfoChip;