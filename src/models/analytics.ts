enum Period {
    Week,
    Month,
    Quarter,
    Year,
}

enum Algorithm {
    Linear
}

type DataItem = {
    date: Date;
    value: number;
}

export const getDayOfYear = (date: Date): number => {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
};

export const getLastDayOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}




export const getPeriodStep = (date: Date, period: Period): Date => {
    switch (period) {
        case Period.Week:
            date.setMonth(date.getMonth() + 1)
            break;
        case Period.Month:
            date.setMonth(date.getMonth() + 1)
            break;
    
        default:
            break;
    }
    return date;
}

export const getCashflow = (from: Date, duration: number, amount: number, amountInit: number, algorithm: Algorithm, period: Period): DataItem[] | undefined => {
  let dataset: DataItem[] = []
  if (!from) return undefined;
  if (duration < 0) return undefined;
  if (amount < 0) return undefined;
  if (amountInit < 0) return undefined;

  let durationInDays = from.valueOf() + duration

  

  return dataset
}