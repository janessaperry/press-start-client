type Props = {
  label: string,
  size?: "sm" | "md"
}

export const BadgeNumber = ({label, size = "sm"}: Props) => {
  const sizeStyleMap = {
    "sm": "w-12 h-12 text-xl",
    "md": "w-16 h-16 text-2xl",
  }
  const badgeColor: string = label === 'n/a' ? 'text-secondary-100 border-secondary-100' : "text-success border-success"

  return (
    <div className={`shrink-0 font-extrabold flex items-center justify-center border-2 rounded-full ${badgeColor} ${sizeStyleMap[size]}`}>
      {label}
    </div>
  )
}

export const BadgeText = ({label}: Props) => {
  return (
    <p className="px-1 text-secondary-100 text-center font-semibold uppercase border border-secondary-100 inline-block rounded-sm">{label}</p>
  )
}