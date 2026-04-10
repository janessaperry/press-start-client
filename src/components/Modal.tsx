import { ComponentPropsWithoutRef } from "react";
import { Button } from "@headlessui/react";
import { XIcon } from "@phosphor-icons/react";

import ButtonIcon from "./ButtonIcon.tsx";

type Props = {
  className?: string,
  modalOpen: boolean,
  setModalOpen: (value: boolean) => void
} & ComponentPropsWithoutRef<'div'>

const Modal = ({ children, className, modalOpen, setModalOpen }: Props) => {
  return (
    <div className={`${className || ''} ${modalOpen ? '' : 'hidden '} fixed top-0 w-full h-dvh p-4  bg-blue-900/60 backdrop-blur-lg`}>
      <ButtonIcon handleClick={() => setModalOpen(false)} icon={XIcon} variant='ghost'/>
      {children}

      <div>
        <Button>Cancel</Button>
        <Button>Submit</Button>
      </div>
    </div>
  )
}

export default Modal;