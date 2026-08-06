import axios from "axios";
import { useEffect, useState } from "react";
import apiClient from "../api/client.ts";
import { getRetryAfterMessage } from "../utils/rateLimiting.ts";
import {
  LibraryFormatOption,
  LibraryStatusEnum,
  LibraryStatusOption,
  SelectOption
} from "../types/common.ts";
import useAuth from "./useAuth.ts";

type InitialData = {
  libraryPlatform?: SelectOption;
  libraryFormat?: LibraryFormatOption;
  libraryStatus: LibraryStatusOption;
}

const useLibraryGame = (
  gameId: number,
  initialData?: InitialData,
  onDelete?: (gameId: number, libraryStatus: LibraryStatusEnum) => void,
  onStatusUpdate?: (gameId: number, prevLibraryStatus: LibraryStatusEnum, newLibraryStatus: LibraryStatusEnum) => void,
) => {
  const { userId } = useAuth();

  const [ inLibrary, setInLibrary ] = useState(!!initialData?.libraryStatus);
  const [ unavailable, setUnavailable ] = useState(false);
  const [ error, setError ] = useState('');
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
        const response = await apiClient.get(`/users/${userId}/library/${gameId}`);
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
        if (axios.isAxiosError(e) && e.response?.status === 429) {
          setUnavailable(true);
        }
        else {
          setInLibrary(false);
        }
      }
    }

    void fetchUserLibraryGame();
  }, [ gameId, userId ]);

  const handleSubmit = async (selectedStatus: SelectOption) => {
    if (!userId) return;

    setError('');
    const payload = {
      gameId,
      libraryPlatform: selectedPlatform,
      libraryFormat: selectedFormat,
      libraryStatus: selectedStatus
    }

    try {
      const response = await apiClient.post(`/users/${userId}/library`, payload);
      if (response.status === 201) {
        setInLibrary(true);
      }
    }
    catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 429) {
        setError(getRetryAfterMessage(e.response.headers));
      }
      else {
        setError('Unable to update library. Please try again.');
      }
    }
  }

  const handleUpdate = async (updatedField: Partial<{
    libraryPlatform: SelectOption;
    libraryFormat: LibraryFormatOption;
    libraryStatus: LibraryStatusOption;
  }>) => {
    setError('');
    try {
      const [ key, value ] = Object.entries(updatedField)[0] as [ 'libraryPlatform' | 'libraryFormat' | 'libraryStatus', SelectOption | LibraryFormatOption | LibraryStatusOption ];
      const current = {
        libraryPlatform: selectedPlatform,
        libraryFormat: selectedFormat,
        libraryStatus: selectedStatus
      }[key];
      if (current.id === value.id) return;

      await apiClient.patch(`/users/${userId}/library/${gameId}`, updatedField);

      if (Object.hasOwn(updatedField, 'libraryStatus')) {
        const prevStatusEnum = selectedStatus.enum;
        const newStatusEnum = updatedField.libraryStatus!.enum;
        if (prevStatusEnum && newStatusEnum && prevStatusEnum !== newStatusEnum && onStatusUpdate !== undefined) {
          onStatusUpdate(gameId, prevStatusEnum, newStatusEnum)
        }
      }
    }
    catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 429) {
        setError(getRetryAfterMessage(e.response.headers));
      }
      else {
        setError('Unable to update library. Please try again.');
      }
      throw e;
    }
  }

  const handleDelete = async () => {
    setError('');
    try {
      await apiClient.delete(`/users/${userId}/library/${gameId}`);
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
    catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 429) {
        setError(getRetryAfterMessage(e.response.headers));
      }
      else {
        setError('Unable to remove game from library. Please try again.');
      }
    }
  }

  return {
    handleSubmit, handleUpdate, handleDelete,
    selectedPlatform, setSelectedPlatform,
    selectedFormat, setSelectedFormat,
    selectedStatus, setSelectedStatus,
    inLibrary, setInLibrary,
    unavailable,
    error,
  }
}

export default useLibraryGame;