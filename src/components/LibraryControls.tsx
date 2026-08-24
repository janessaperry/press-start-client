import { useState } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CaretDownIcon, CheckIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import useLibraryGame from "../hooks/useLibraryGame.ts";
import { LibraryStatusEnum, SelectOption } from "../types/common.ts";
import Alert from "./Alert.tsx";
import ButtonIcon from "./ButtonIcon.tsx";

type Props = {
  gameOverview: {
    id: number;
    platforms: SelectOption[];
  };
  libraryData?: {
    libraryPlatform: SelectOption;
    libraryFormat: SelectOption;
    libraryStatus: SelectOption;
  },
  libraryFormatOptions?: SelectOption[];
  libraryStatusOptions?: SelectOption[];
  onDelete?: (gameId: number, libraryStatus: LibraryStatusEnum) => void;
  onStatusUpdate?: (prevLibraryStatus: LibraryStatusEnum, newLibraryStatus: LibraryStatusEnum) => void;
  showTitle?: boolean;
}

const JUST_ADDED_DURATION = 1500;

const LibraryControls = ({
  gameOverview,
  libraryData, libraryFormatOptions, libraryStatusOptions,
  onDelete, onStatusUpdate,
  showTitle = false,
}: Props) => {
  const [ justAdded, setJustAdded ] = useState(false);

  const {
    handleSubmit, handleUpdate, handleDelete,
    selectedPlatform, setSelectedPlatform,
    selectedFormat, setSelectedFormat,
    selectedStatus, setSelectedStatus,
    inLibrary, unavailable, error
  } = useLibraryGame(gameOverview.id, libraryData, onDelete, onStatusUpdate);

  if (unavailable) {
    return (
      <div className="space-y-2">
        <p className="text-xl font-semibold">Library Currently Unavailable</p>
        <p className="text-lg">
          Please try again later.
        </p>
        {/*<p className="text-lg">*/}
        {/*  Please try again later. If the issue persists, contact <a href="mailto:hello@pressstart.gg"*/}
        {/*  className="link-primary">hello@pressstart.gg</a>.*/}
        {/*</p>*/}
      </div>
    );
  }

  const onStatusChange = async (newStatus: SelectOption) => {
    const prev = selectedStatus;
    setSelectedStatus(newStatus);

    try {
      if (!inLibrary) {
        await handleSubmit(newStatus);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), JUST_ADDED_DURATION);
      }
      else {
        await handleUpdate({ libraryStatus: newStatus });
      }
    }
    catch {
      setSelectedStatus(prev);
    }
  }

  const onPlatformChange = async (newPlatform: SelectOption) => {
    const prev = selectedPlatform;
    setSelectedPlatform(newPlatform);
    try {
      if (inLibrary) await handleUpdate({ libraryPlatform: newPlatform });
    }
    catch {
      setSelectedPlatform(prev);
    }
  }

  const onFormatChange = async (newFormat: SelectOption) => {
    const prev = selectedFormat;
    setSelectedFormat(newFormat);
    try {
      if (inLibrary) await handleUpdate({ libraryFormat: newFormat });
    }
    catch {
      setSelectedFormat(prev);
    }
  }

  return (
    <>
      {showTitle && (
        <header className="space-y-2">
          <h3>{inLibrary ? "Manage Game in Library" : "Add to Library"}</h3>
          <p>Select the console and format you own the game in and add to your
            library, or just add it to your wishlist.
          </p>
        </header>
      )}

      {error && (
        <Alert message={error} variant="warning" className="mb-3"/>
      )}

      <form className="flex flex-col gap-2 md:gap-4">
        <div className="flex gap-2">
          <Listbox value={selectedPlatform}
            onChange={(value) => onPlatformChange(value)}
            by="id">
            <ListboxButton className="flex-1 min-w-0 button ghost justify-between">
              <span className="truncate">{selectedPlatform.label}</span> <CaretDownIcon weight="bold"
              className="shrink-0"/>
            </ListboxButton>

            <ListboxOptions anchor="bottom end" className="dropdown-options">
              {gameOverview.platforms.map((item: SelectOption) => (
                <ListboxOption key={item.id} value={item} className="dropdown-option">
                  {item.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>

          <Listbox value={selectedFormat} onChange={(value) => onFormatChange(value)} by="id">
            <ListboxButton className="flex-1 min-w-0 button ghost justify-between">
              <span className="truncate">{selectedFormat.label}</span> <CaretDownIcon weight="bold"
              className="shrink-0"/>
            </ListboxButton>

            <ListboxOptions anchor="bottom end" className="dropdown-options">
              {libraryFormatOptions?.map((item: SelectOption) => (
                <ListboxOption key={item.id} value={item} className="dropdown-option">
                  {item.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </div>

        <div className="flex">
          <Listbox value={selectedStatus}
            onChange={(value) => onStatusChange(value)} by="id">
            <ListboxButton className="button primary justify-between grow min-w-0">
              <span className="truncate">{selectedStatus.label}</span> <CaretDownIcon weight="bold"
              className="shrink-0"/>
            </ListboxButton>

            <ListboxOptions anchor="bottom end" className="dropdown-options">
              {libraryStatusOptions?.map((item: SelectOption) => (
                <ListboxOption key={item.id} value={item} className="dropdown-option">
                  {item.label}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>


          <div className={`grid ${inLibrary ? 'ml-2 grid-cols-[1fr]' : 'grid-cols-[0fr]'} transition-[grid-template-columns] duration-500`}>
            <div className="overflow-hidden min-w-0">
              <div className="relative">
                <div className={`p-2.5 flex items-center bg-success text-success-900 rounded-full transition-opacity duration-500 ${justAdded ? 'opacity-100 animate-slide-in-left' : 'opacity-0 pointer-events-none'}`}>
                  <CheckIcon className="icon-md"/>
                </div>
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${inLibrary && !justAdded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <ButtonIcon handleClick={handleDelete} icon={TrashSimpleIcon} variant="danger" type="button"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default LibraryControls;
