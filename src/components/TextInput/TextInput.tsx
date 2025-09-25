// Libraries
import { InputHTMLAttributes } from "react";

// Layouts

// Route Logic

// Components
import { WarningCircleIcon } from "@phosphor-icons/react";
import { Description, Field, Label } from "@headlessui/react";

// Utils

// Pages

// Types
type TextInputProps = {
  id: string;
  label: string;
  description?: string;
  errorMessage?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const TextInput = ({
  id,
  label,
  description,
  errorMessage,
  type = "text",
  required = false,
  ...inputProps
}: TextInputProps) => {
  return (
    <Field className="flex flex-col gap-1">
      <Label htmlFor={id}
        className="text-lg">{label} {required && <span className="text-required">*</span>}</Label>
      <input id={id}
        type={type}
        className="text-md text-secondary-900 border-2 border-primary-300 px-4 py-2 bg-grey-50" {...inputProps}/>

      {description && <Description className="mb-0 text-sm text-secondary">{description}</Description>}
      {errorMessage &&
        <Description className="flex flex-row items-center gap-1 leading-none mb-0 mt-2 text-sm text-error-500">
          <WarningCircleIcon weight="duotone" size={18}/>
          {errorMessage}
        </Description>}
    </Field>
  );
};

export default TextInput;
