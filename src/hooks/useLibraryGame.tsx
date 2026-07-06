import { useEffect, useState } from "react";
import axios from "axios";
import {
  LibraryFormatOption,
  LibraryStatusEnum,
  LibraryStatusOption,
  SelectOption
} from "../types/common.ts";
import useAuth from "./useAuth.tsx";

type InitialData = {
  libraryPlatform?: SelectOption;
  libraryFormat?: LibraryFormatOption;
  libraryStatus: LibraryStatusOption;
}

const baseServerUrl = import.meta.env.VITE_SERVER_URL;
const useLibraryGame = (
  gameId: number,
  initialData?: InitialData,
  onDelete?: (gameId: number, libraryStatus: LibraryStatusEnum) => void,
  onStatusUpdate?: (gameId: number, prevLibraryStatus: LibraryStatusEnum, newLibraryStatus: LibraryStatusEnum) => void,
) => {
  const { userId } = useAuth();

  const [ inLibrary, setInLibrary ] = useState(!!initialData?.libraryStatus);
  const [ selectedPlatform, setSelectedPlatform ] = useState<SelectOption>(initialData?.libraryPlatform ?? {
    id: 0, label: `Select a console`
  });
  const [ selectedFormat, setSelectedFormat ] = useState<LibraryFormatOption>(initialData?.libraryFormat ?? {
    id: 0, label: `Select a format`
  });
  const [ selectedStatus, setSelectedStatus ] = useState<LibraryStatusOption>(initialData?.libraryStatus ?? {
    id: 0, label: `Add to library`
  });

  useEffect(() => {
    if (!userId || initialData) return;

    const fetchUserLibraryGame = async () => {
      try {
        const response = await axios.get(`${baseServerUrl}/users/${userId}/library/${gameId}`);
        setInLibrary(true);

        const { libraryPlatform, libraryFormat, libraryStatus } = response.data;
        const userLibraryGamePlatform = libraryPlatform ? {
          id: libraryPlatform.id,
          label: libraryPlatform.label
        } : undefined;
        const userLibraryGameFormat = libraryFormat ? { id: libraryFormat.id, label: libraryFormat.label } : undefined;
        const userLibraryStatus = libraryStatus ? { id: libraryStatus.id, label: libraryStatus.label } : undefined;

        if (userLibraryGamePlatform) setSelectedPlatform(userLibraryGamePlatform);
        if (userLibraryGameFormat) setSelectedFormat(userLibraryGameFormat);
        if (userLibraryStatus) setSelectedStatus(userLibraryStatus);
      }
      catch (e) {
        console.log("Game not found in library: ", e);
        setInLibrary(false);
      }
    }

    void fetchUserLibraryGame();
  }, [ gameId, userId ]);

  const handleSubmit = async (selectedStatus: SelectOption) => {
    if (!userId) {
      console.log("you need to create an account");
      return;
    }

    const payload = {
      gameId,
      libraryPlatform: selectedPlatform,
      libraryFormat: selectedFormat,
      libraryStatus: selectedStatus
    }
    const response = await axios.post(`${baseServerUrl}/users/${userId}/library`, payload);
    if (response.status === 201) {
      setInLibrary(true);
    }
  }

  const handleUpdate = async (updatedField: Partial<{
    libraryPlatform: SelectOption;
    libraryFormat: LibraryFormatOption;
    libraryStatus: LibraryStatusOption;
  }>) => {

    //todo make sure updated is different from previous before the api call too
    await axios.patch(`${baseServerUrl}/users/${userId}/library/${gameId}`, updatedField);

    if (Object.hasOwn(updatedField, 'libraryStatus')) {
      const prevStatusEnum = selectedStatus.enum;
      const newStatusEnum = updatedField.libraryStatus!.enum;
      if (prevStatusEnum && newStatusEnum && prevStatusEnum !== newStatusEnum && onStatusUpdate !== undefined) {
        onStatusUpdate(gameId, prevStatusEnum, newStatusEnum)
      }
    }
  }

  const handleDelete = async () => {
    await axios.delete(`${baseServerUrl}/users/${userId}/library/${gameId}`);
    if (onDelete !== undefined) {
      if (selectedStatus.enum) {
        onDelete(gameId, selectedStatus.enum);
      }
    }

    setInLibrary(false);
    setSelectedPlatform({ id: 0, label: "Select a console" });
    setSelectedFormat({ id: 0, label: "Select a format" });
    setSelectedStatus({ id: 0, label: "Add to library" });
  }

  return {
    handleSubmit, handleUpdate, handleDelete,
    selectedPlatform, setSelectedPlatform,
    selectedFormat, setSelectedFormat,
    selectedStatus, setSelectedStatus,
    inLibrary, setInLibrary,
  }
}

export default useLibraryGame;