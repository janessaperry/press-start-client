import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CaretDownIcon, TrashSimpleIcon } from "@phosphor-icons/react";
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
  onStatusUpdate?: (gameId: number, prevLibraryStatus: LibraryStatusEnum, newLibraryStatus: LibraryStatusEnum) => void;
  showTitle?: boolean;
}

const LibraryControls = ({
  gameOverview,
  libraryData,
  libraryFormatOptions,
  libraryStatusOptions,
  onDelete,
  onStatusUpdate,
  showTitle = false,
}: Props) => {
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
          Please try again later. If the issue persists, contact <a href="mailto:hello@pressstart.gg"
          className="link-primary">hello@pressstart.gg</a>.
        </p>
      </div>
    );
  }

  const onStatusChange = async (newStatus: SelectOption) => {
    const prev = selectedStatus;
    setSelectedStatus(newStatus);

    try {
      if (!inLibrary) {
        await handleSubmit(newStatus);
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
        <header className="space-y-4">
          <h2>{inLibrary ? "Manage Game in Library" : "Add to Library"}</h2>
          <p className="text-sm italic">Select the console and format you own the game in and add to your
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

          <Listbox value={selectedFormat} onChange={(value) => onFormatChange(value)} by="id">
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
            onChange={(value) => onStatusChange(value)} by="id">
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
