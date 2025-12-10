type Props = {
  label: string
}

export const BadgeNumber = ({label}: Props) => {
  return (
    <div className="p-2 aspect-square text-2xl font-extrabold text-success border-2 border-success rounded-full">
      {label}
    </div>
  )
}

export const BadgeText = ({label}: Props) => {
  return (
    <p className="px-1 text-secondary-100 font-semibold uppercase border border-secondary-100 inline-block rounded-sm">{label}</p>
  )
}