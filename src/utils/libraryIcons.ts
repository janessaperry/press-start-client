import { GameControllerIcon, Icon as PhosphorIcon } from "@phosphor-icons/react";
import {
  BookmarkSimpleIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  PauseCircleIcon,
  ListHeartIcon
} from "@phosphor-icons/react";
import { LibraryStatusEnum } from "../types/common";

export const LIBRARY_STATUS_ICONS: Record<LibraryStatusEnum, PhosphorIcon> = {
  WANT_TO_PLAY: BookmarkSimpleIcon,
  PLAYING: PlayCircleIcon,
  PLAYED: CheckCircleIcon,
  ON_PAUSE: PauseCircleIcon,
  PLAY_ANYTIME: GameControllerIcon,
  WISHLIST: ListHeartIcon,
};