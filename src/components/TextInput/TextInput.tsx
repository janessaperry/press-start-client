// Libraries

// Layouts

// Route Logic

// Components
import { Field, Input, Label } from "@headlessui/react";

// Utils

// Pages

// Styles
import styles from './TextInput.module.css';

// Types
type TextInputProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

const TextInput = ({ id, label, type = "text", placeholder, required = false }: TextInputProps) => {
  return (
    <Field className={`${styles.formField} flex flex-col gap-1`}>
      <Label htmlFor={id}
             className={styles.formLabel}>{label} {required && <span className={styles.required}>*</span>}</Label>
      <Input id={id} type={type} placeholder={placeholder} className={styles.formInput}/>
    </Field>
  );
};

export default TextInput;