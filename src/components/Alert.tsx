import { CheckCircleIcon, InfoIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { ReactNode } from "react";

type Variant = "warning" | "info" | "success";
type Props = {
  variant: Variant;
  message: string;
  children?: ReactNode
}

const variantStyles = {
  warning: "text-error-500 bg-error-500/20",
  info: "text-info-500 bg-info-900/50",
  success: "text-success bg-info-900/50",
}

const variantIcons = {
  warning: WarningCircleIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
}

const Alert = ({ variant = 'info', message, children }: Props) => {
  const Icon = variantIcons[variant];

  return (
    <div className={`${variantStyles[variant]} px-4 py-2 rounded-md flex flex-col gap-1`}
      role={variant === 'warning' ? 'alert' : 'status'}
      aria-live={variant === 'warning' ? 'assertive' : 'polite'}
      aria-atomic="true">

      <div className="flex gap-2">
        <Icon weight="bold" size={18} className="relative top-1 shrink-0"/>

        <p className="font-bold">{message} {children}</p>
      </div>
    </div>
  )
}

export default Alert;