import { ComponentPropsWithoutRef, useState } from "react";
import { EyeIcon, EyeSlashIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Description, Field, Label } from "@headlessui/react";

type TextInputProps = {
  label: string;
  description?: string;
  errorMessage?: string;
} & ComponentPropsWithoutRef<'input'>;

const TextInput = ({
  id,
  label,
  description,
  errorMessage,
  type = "text",
  required = false,
  ...inputProps
}: TextInputProps) => {
  const [ showPassword, setShowPassword ] = useState(false);
  const isPassword = type === "password";

  return (
    <Field className="flex flex-col gap-1">
      <Label htmlFor={id}
        className="text-lg">{label} {required && <span className="text-required">*</span>}</Label>

      <div className={isPassword ? "relative" : undefined}>
        <input id={id}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={isPassword ? "w-full pr-10" : undefined}
          {...inputProps}/>

        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-900">
            {showPassword ?
              <EyeSlashIcon className="icon-md text-grey-600 hover:text-secondary-900 transition-all duration-200"/> :
              <EyeIcon className="icon-md text-grey-600 hover:text-secondary-900 transition-all duration-200"/>
            }
          </button>
        )}
      </div>

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
