export const getRetryAfterMessage = (retryAfterHeader: unknown): string => {
  const secs = Number(retryAfterHeader);
  const mins = Number.isNaN(secs) ? null : Math.ceil(secs / 60);
  return mins !== null
    ? `Too many requests. Please try again after ${mins} minutes.`
    : 'Too many requests. Please try again later.';
}
