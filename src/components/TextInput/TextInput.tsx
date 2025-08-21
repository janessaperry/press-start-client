// Libraries
import { InputHTMLAttributes } from "react";

// Layouts

// Route Logic

// Components
import { WarningCircleIcon } from "@phosphor-icons/react";
import { Description, Field, Input, Label } from "@headlessui/react";

// Utils

// Pages

// Styles
import styles from './TextInput.module.css';

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
    <Field className={`${styles.formField} flex flex-col gap-1`}>
      <Label htmlFor={id}
             className={styles.formLabel}>{label} {required && <span className={styles.required}>*</span>}</Label>
      <Input id={id} type={type} className={styles.formInput} {...inputProps}/>

      {description && <Description className="mb-0 text-sm text-secondary">{description}</Description>}
      {errorMessage &&
        <Description className={`flex flex-row items-center gap-1 leading-none mb-0 mt-2 text-sm text-error`}>
          <WarningCircleIcon weight="duotone" size={18}/>
          {errorMessage}
        </Description>}
    </Field>
  );
};

export default TextInput;