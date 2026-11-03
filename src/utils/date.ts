export const toIsoUtc = (date: Date = new Date()): string => {
  return date.toISOString();
};

export const formatDisplayDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

