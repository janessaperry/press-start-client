import { ComponentPropsWithoutRef } from "react";

type Props = {
  label: string,
  variant?: "primary" | "secondary",
  size?: "xs" | "sm" | "md"
} & ComponentPropsWithoutRef<'p'>;

const InfoChip = ({label, variant = "primary", size = "md"}: Props) => {
  const variantStyleMap = {
    "primary": "",
    "secondary": "bg-blue-500"
  }

  const sizeStyleMap = {
    "xs": "py-1 px-2 text-xs md:text-sm",
    "sm": "py-1 px-2 text-sm md:text-base",
    "md": "p-2 md:py-2 md:px-3 text-base md:text-lg"
  }

  return (
    <p className={`leading-none text-grey-50 border border-primary-300 rounded-full ${sizeStyleMap[size]} ${variantStyleMap[variant]}`}
    >
      {label}
    </p>
  )
}

export default InfoChip;