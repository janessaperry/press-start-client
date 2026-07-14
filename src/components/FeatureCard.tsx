import { ComponentPropsWithoutRef } from "react";

type Props = {
  title: string;
  description: string;
} & ComponentPropsWithoutRef<'button'>;

const FeatureCard = ({ title, description, className, ...rest }: Props) => {
  return (
    <button
      className={`flex flex-col p-4 text-left bg-secondary-500 border border-secondary-200/20 hover:border-accent-300/40 aria-selected:border-accent-300/80 transition-colors space-y-2 rounded-2xl ${className ?? ''}`}
      {...rest}>
      <h4>{title}</h4>
      <p>{description}</p>
    </button>
  )
}

export default FeatureCard;