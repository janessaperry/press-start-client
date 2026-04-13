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
    <div className={`${className || ''} ${modalOpen ? 'modal-open' : 'hidden'} fixed top-0 w-full h-dvh p-4 bg-blue-900/60 backdrop-blur-lg space-y-8`}>
      <ButtonIcon handleClick={() => setModalOpen(false)} icon={XIcon} variant='ghost'/>
      {children}

      <div className="flex items-center gap-4">
        <Button className="flex-1 button neutral"
          onClick={() => console.log('cancel filters and close modal')}>Cancel</Button>
        <Button className="flex-1 button primary"
          onClick={() => console.log('apply filters and close modal')}>Submit</Button>
      </div>
    </div>
  )
}

export default Modal;