const convertSecondsToHours = (seconds: number) => {
  return seconds / 60 / 60;
}

export const formatTimeToBeat = (seconds: number | null): string => {
  if (!seconds) return 'n/a';
  return `${Math.round(convertSecondsToHours(seconds))}H`
}
