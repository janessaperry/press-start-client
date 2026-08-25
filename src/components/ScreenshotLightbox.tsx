import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XIcon } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { getScreenshotUrl } from "../utils/images.ts";
import ButtonIcon from "./ButtonIcon.tsx";

type Props = {
  imageId: string | null;
  alt: string;
  onClose: () => void;
}

const ScreenshotLightbox = ({ imageId, alt, onClose }: Props) => {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  useEffect(() => {
    transformRef.current?.resetTransform(0);
  }, [ imageId ]);

  return (
    <Dialog open={imageId !== null} onClose={onClose} className="fixed inset-0 z-50">
      <DialogBackdrop className="fixed inset-0 bg-blue-900/90 backdrop-blur-lg"/>

      <DialogPanel className="absolute h-dvh w-full flex items-center justify-center p-4 md:p-10">
        <ButtonIcon handleClick={onClose} icon={XIcon} variant="ghost" className="absolute top-4 right-4 z-10"/>

        {imageId && (
          <TransformWrapper ref={transformRef}
            centerOnInit
            limitToBounds
            minScale={1}
            maxScale={4}
            doubleClick={{ disabled: true }}>
            <TransformComponent wrapperClass="!w-full !h-4/5">
              <img src={getScreenshotUrl(imageId, 'screenshot_huge')} alt={alt}/>
            </TransformComponent>
          </TransformWrapper>
        )}
      </DialogPanel>
    </Dialog>
  );
};

export default ScreenshotLightbox;