export const isOldDay = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date < today;
  };

export const isFutureDay = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date > today;
  };

export const getWeekday = (dateString: string) => {
  const d = new Date(dateString);
  return d.getDay();
};