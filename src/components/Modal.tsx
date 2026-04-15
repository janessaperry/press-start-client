import { ComponentPropsWithoutRef } from "react";
import { Button } from "@headlessui/react";
import { XIcon } from "@phosphor-icons/react";

import ButtonIcon from "./ButtonIcon.tsx";

type Props = {
  className?: string,
  modalOpen: boolean,
  setModalOpen: (value: boolean) => void,
  handleSubmit: () => void,
  handleCancel: () => void,
} & ComponentPropsWithoutRef<'div'>

const Modal = ({ children, className, modalOpen, setModalOpen, handleSubmit, handleCancel }: Props) => {
  const onCancel = () => {
    handleCancel()
    setModalOpen(false)
  }

  const onSubmit = () => {
    handleSubmit();
    setModalOpen(false);
  }

  return (
    <div className={`${className || ''} ${modalOpen ? 'modal-open' : 'hidden'} fixed top-0 w-full h-dvh p-4 bg-blue-900/60 backdrop-blur-lg flex flex-col gap-8`}>
      <ButtonIcon handleClick={() => setModalOpen(false)} icon={XIcon} variant='ghost' className="self-end"/>

      <div className="overflow-y-scroll scrollbar-on-dark">
        {children}
      </div>

      <div className="flex items-center gap-4">
        <Button className="flex-1 button neutral"
          onClick={onCancel}>Cancel</Button>
        <Button className="flex-1 button primary"
          onClick={onSubmit}>Submit</Button>
      </div>
    </div>
  )
}

export default Modal;