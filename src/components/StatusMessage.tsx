import { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { ReactNode } from "react";

type Props = {
  icon: PhosphorIcon;
  variant: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  children?: ReactNode;
}

const StatusMessage = ({ icon: Icon, variant = "info", title, message, children }: Props) => {
  const variantStyles = {
    info: 'bg-accent-500/10 text-accent-300/80',
    warning: 'bg-warning-500/10 text-warning-500/80',
    error: 'bg-error-900/50 text-error-500',
  }

  return (
    <div className="w-full p-4 flex flex-col items-center justify-center gap-4 text-center">
      <div className={`p-3 rounded-full ${variantStyles[variant]}`}>
        <Icon className="icon-2xl"/>
      </div>

      <div className="space-y-2">
        <h3>{title}</h3>
        <p className="text-lg text-secondary-100">
          {message}
        </p>
      </div>

      {children}
    </div>
  )
}

export default StatusMessage;