import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CaretDownIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import useLibraryGame from "../hooks/useLibraryGame.ts";
import { GameOverview, LibraryStatusEnum, SelectOption } from "../types/common.ts";
import ButtonIcon from "./ButtonIcon.tsx";

type Props = {
  gameOverview: GameOverview;
  libraryData?: {
    libraryPlatform: SelectOption;
    libraryFormat: SelectOption;
    libraryStatus: SelectOption;
  },
  libraryFormatOptions?: SelectOption[];
  libraryStatusOptions?: SelectOption[];
  onDelete?: (gameId: number, libraryStatus: LibraryStatusEnum) => void;
  onStatusUpdate?: (gameId: number, prevLibraryStatus: LibraryStatusEnum, newLibraryStatus: LibraryStatusEnum) => void;
}

const LibraryControls = ({
  gameOverview,
  libraryData,
  libraryFormatOptions,
  libraryStatusOptions,
  onDelete,
  onStatusUpdate
}: Props) => {
  const {
    handleSubmit, handleUpdate, handleDelete,
    selectedPlatform, setSelectedPlatform,
    selectedFormat, setSelectedFormat,
    selectedStatus, setSelectedStatus,
    inLibrary
  } = useLibraryGame(gameOverview.id, libraryData, onDelete, onStatusUpdate);

  const onStatusChange = async (selectedStatus: SelectOption) => {
    setSelectedStatus(selectedStatus);

    if (!inLibrary) {
      await handleSubmit(selectedStatus);
    }
    else {
      await handleUpdate({ libraryStatus: selectedStatus })
    }
  }

  const onPlatformChange = async (selectedPlatform: SelectOption) => {
    setSelectedPlatform(selectedPlatform);
    if (inLibrary) await handleUpdate({ libraryPlatform: selectedPlatform });
  }

  const onFormatChange = async (selectedFormat: SelectOption) => {
    setSelectedFormat(selectedFormat);
    if (inLibrary) await handleUpdate({ libraryFormat: selectedFormat })
  }

  return (
    <>
      <form className="flex flex-col gap-2 md:gap-4">
        <div className="flex gap-2">
          <Listbox value={selectedPlatform}
            onChange={(selectedPlatform) => onPlatformChange(selectedPlatform)}
            by="id">
            <ListboxButton className="flex-1 min-w-0 button ghost justify-between">
              <span className="truncate">{selectedPlatform.label}</span> <CaretDownIcon weight="bold"
              className="shrink-0"/>
            </ListboxButton>

            <ListboxOptions anchor="bottom end"
              className="p-2 mt-2 w-(--button-width) min-w-40 text-secondary-900 bg-grey-50 rounded-2xl focus-visible:outline-accent-700">
              {gameOverview.platforms.map((item: SelectOption) => (
                <ListboxOption key={item.id}
                  value={item}
                  className="p-2 data-focus:bg-grey-100 data-selected:font-semibold data-selected:bg-purple-100 rounded-lg cursor-pointer"
                >
                  {item.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>

          <Listbox value={selectedFormat} onChange={(selectedFormat) => onFormatChange(selectedFormat)} by="id">
            <ListboxButton className="flex-1 min-w-0 button ghost justify-between">
              <span className="truncate">{selectedFormat.label}</span> <CaretDownIcon weight="bold"
              className="shrink-0"/>
            </ListboxButton>

            <ListboxOptions anchor="bottom end"
              className="p-2 mt-2 w-(--button-width) min-w-40 text-secondary-900 bg-grey-50 rounded-2xl focus-visible:outline-accent-700">
              {libraryFormatOptions?.map((item: SelectOption) => (
                <ListboxOption key={item.id} value={item}
                  className="p-2 data-focus:bg-grey-100 data-selected:font-semibold data-selected:bg-purple-100 rounded-lg cursor-pointer"
                >
                  {item.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </div>

        <div className="flex gap-2">
          <Listbox value={selectedStatus}
            onChange={(selectedStatus) => onStatusChange(selectedStatus)} by="id">
            <ListboxButton className="button primary justify-between grow min-w-0">
              <span className="truncate">{selectedStatus.label}</span> <CaretDownIcon weight="bold"
              className="shrink-0"/>
            </ListboxButton>

            <ListboxOptions anchor="bottom end"
              className="p-2 mt-2 w-(--button-width) min-w-40 text-secondary-900 bg-grey-50 rounded-2xl focus-visible:outline-accent-700">
              {libraryStatusOptions?.map((item: SelectOption) => (
                <ListboxOption key={item.id} value={item}
                  className="p-2 data-focus:bg-grey-100 data-selected:font-semibold data-selected:bg-purple-100 rounded-lg cursor-pointer"
                >
                  {item.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>

          {inLibrary &&
            <ButtonIcon handleClick={handleDelete} icon={TrashSimpleIcon}
              variant="danger" className="border border-danger-900" type="button"/>
          }
        </div>
      </form>
    </>
  )
}

export default LibraryControls;
