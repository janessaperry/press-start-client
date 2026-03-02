type Props = {
  label: string,
  size?: "xs" | "sm" | "md"
}

export const BadgeNumber = ({label, size = "sm"}: Props) => {
  const sizeStyleMap = {
    "xs": "size-8 text-sm lg:size-10 lg:text-md",
    "sm": "size-10 text-lg lg:size-12 lg:text-xl",
    "md": "size-12 text-xl lg:size-16 lg:text-2xl",
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
    <span className={`px-1 text-secondary-100 text-center font-semibold uppercase border border-secondary-100 rounded-sm ${sizeStyleMap[size]}`}>{label}</span>
  )
}