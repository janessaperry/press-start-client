import { ComponentType, ComponentPropsWithoutRef } from "react";

type Props = {
  variant?: 'primary' | 'secondary' | 'ghost',
  icon: ComponentType<{ className?: string }>,
  iconSize?: 'sm' | 'md' | 'lg' | 'xl',
  handleClick: () => void
} & ComponentPropsWithoutRef<'button'>

const ButtonIcon = ({ variant = 'primary', icon: Icon, iconSize = 'md', handleClick, className }: Props) => {
  return (
    <button className={`p-2 button ${variant} ${className ? className : ''}`} onClick={handleClick}>
      <Icon className={`icon-${iconSize}`}/>
    </button>
  )
}

export default ButtonIcon;