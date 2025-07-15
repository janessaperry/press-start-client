// Libraries
import React from "react";

// Layouts

// Route Logic

// Components
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
} & React.InputHTMLAttributes<HTMLInputElement>;

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
        <Description className={`mb-0 text-sm text-error ${styles.errorToast}`}>{errorMessage}</Description>}

    </Field>
  );
};

export default TextInput;