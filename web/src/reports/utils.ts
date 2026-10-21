/**
 * Pads an array with nulls up to the maxLength, returning a sliced version of exactly that length.
 */
export function padList<T>(list: T[], maxLength: number): (T | null)[] {
    const padded: (T | null)[] = [...list];
    while (padded.length < maxLength) {
        padded.push(null);
    }
    return padded.slice(0, maxLength);
}

/**
 * Checks if a date string is within the given date range.
 * date string or dateStr is in the form of YYYY-MM-DD
 */
export function isDateWithinRange(
    dateStr: string,
    rangeDate: { start: Date, end: Date },
    isAllTime: boolean,
): boolean {
    if (isAllTime) return true;
    const dateObj = new Date(dateStr);
    return dateObj >= rangeDate.start && dateObj <= rangeDate.end;
}

/**
 * Checks if a unix timestamp (in seconds) is within the given date range.
 */
export function isTimestampWithinRange(timestamp: number, start: Date, end: Date, isAllTime: boolean): boolean {
    if (isAllTime) return true;
    const dateObj = new Date(timestamp * 1000);
    return dateObj >= start && dateObj <= end;
}
