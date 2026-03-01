type Props = {
  label: string,
  size?: "xs" | "sm" | "md"
}

export const BadgeNumber = ({label, size = "sm"}: Props) => {
  const sizeStyleMap = {
    "xs": "w-10 h-10 text-md",
    "sm": "w-12 h-12 text-xl",
    "md": "w-16 h-16 text-2xl",
  }
  const badgeColor: string = label === 'n/a' ? 'text-secondary-100/40 border-secondary-100/40' : "text-success" +
    " border-success"

  return (
    <div className={`shrink-0 font-extrabold flex items-center justify-center border-2 rounded-full ${badgeColor} ${sizeStyleMap[size]}`}>
      {label}
    </div>
  )
}

export const BadgeText = ({label, size = "sm"}: Props) => {
  const sizeStyleMap = {
    "xs": "text-xs",
    "sm": "text-sm",
    "md": "text-md"
  }
  return (
    <p className={`px-1 text-secondary-100 text-center font-semibold uppercase border border-secondary-100 rounded-sm ${sizeStyleMap[size]}`}>{label}</p>
  )
}