import { monthNames, shortMonthNames } from "./constants";

/**
 * Formats a "YYYY-MM-DD" date string into "DD Mon YYYY" format.
 * Example: "2023-10-15" becomes "15 Oct 2023".
 * 
 * @param date - The date string to format.
 * @returns The formatted date string, or an empty string if no date is provided.
 */
export function formattingDateProject(date?: string | null): string {
    if (!date) return "";
    const dateArray = date.split("-");

    // We explicitly cast dateArray[1] to Number to satisfy TypeScript arithmetic rules
    const formattedDate =
        dateArray[2] +
        " " +
        monthNames[Number(dateArray[1]) - 1].slice(0, 3) +
        " " +
        dateArray[0];

    return formattedDate ? formattedDate : "";
}

/**
 * Formats a "YYYY-MM-DD" date string into "DD Month YYYY" format.
 * Example: "2023-10-15" becomes "15 October 2023".
 * 
 * @param date - The date string to format.
 * @returns The fully expanded formatted date string.
 */
export function formattingDateTask(date: string): string {
    const dateArray = date.split("-");
    const formattedDate =
        dateArray[2] + " " + monthNames[Number(dateArray[1]) - 1] + " " + dateArray[0];

    return formattedDate;
}

/**
 * Returns the current date in "YYYY-MM-DD" format adjusted to the user's local timezone.
 * 
 * @returns A string representing today's date in the user's browser timezone.
 */
export function todayUserTimeZone(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        // Dynamically get the user's browser timezone
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    // "en-CA" ensures YYYY-MM-DD format as a base
    return now.toLocaleDateString("en-CA", options);
}

/**
 * Calculates a human-readable string indicating how many days ago a specific date was.
 * Handles past, present, and future days.
 * 
 * @param dateString - The start date to compare against today.
 * @returns A string such as "Yesterday", "Today", or "X days ago".
 */
export function nDaysAgo(dateString?: string | null): string {
    if (!dateString) return "Has no start date";

    const startDate = new Date(dateString);
    const today = new Date(todayUserTimeZone());

    // Using .getTime() because TypeScript restricts arithmetic operations directly on Date objects
    const daysAgo = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysAgo > 1) return `${daysAgo} days ago`;
    if (daysAgo === 1) return "Yesterday";
    if (daysAgo === 0) return "Today";
    if (daysAgo === -1) return "Tomorrow";

    return `${-daysAgo} days from now`;
}

/**
 * Calculates a human-readable string indicating how many days are left until a deadline.
 * Handles future, present, and overdue deadlines.
 * 
 * @param dateString - The deadline date to compare against today.
 * @returns A string such as "X days left", "Tomorrow", or "X days overdue".
 */
export function nDaysLeft(dateString?: string | null): string {
    if (!dateString) return "Has no deadline";

    const deadline = new Date(dateString);
    const today = new Date(todayUserTimeZone());

    const daysLeft = (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (daysLeft > 1) return `${daysLeft} days left`;
    if (daysLeft === 1) return "Tomorrow";
    if (daysLeft === 0) return "Today";
    if (daysLeft === -1) return "Overdue yesterday";

    return `${-daysLeft} days overdue`;
}

/**
 * Calculates how many days ago a task was completed, interpreting the input as a UNIX epoch.
 * 
 * @param dateString - The completion date as a UNIX timestamp (seconds since epoch).
 * @returns A human-readable relative time string like "Yesterday" or "X days ago".
 */
export const nDaysAgoDone = (dateString?: number | string | null): string => {
    if (!dateString) return "Has no done date";

    // put it in the same format as today, dateString is a unix epoch
    const doneDate = new Date(
        formattingDateProject(
            new Date(Number(dateString) * 1000).toLocaleDateString("en-CA")
        )
    );
    const today = new Date(todayUserTimeZone());
    const daysAgo = Math.floor((today.getTime() - doneDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysAgo > 1) return `${daysAgo} days ago`;
    if (daysAgo === 1) return "Yesterday";
    if (daysAgo === 0) return "Today";
    if (daysAgo === -1) return "Tomorrow";

    return `${-daysAgo} days from now`;
};

/**
 * Calculates the start (Sunday) and end (Saturday) of the week for a given date.
 * 
 * @param date - The target date to evaluate.
 * @returns An object containing the startOfWeek and endOfWeek Date objects.
 */
export function getWeekRange(date: Date): { startOfWeek: Date; endOfWeek: Date } {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - day); // Go back to Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
}

/**
 * Calculates the very first and very last millisecond of the month for a given date.
 * 
 * @param date - The target date to evaluate.
 * @returns An object containing the startOfMonth and endOfMonth Date objects.
 */
export function getMonthRange(date: Date): { startOfMonth: Date; endOfMonth: Date } {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return { startOfMonth, endOfMonth };
}

/**
 * Calculates the start and end dates of the calendar quarter (3-month block) for a given date.
 * 
 * @param date - The target date to evaluate.
 * @returns An object containing the startOfQuarter and endOfQuarter Date objects.
 */
export function getQuarterRange(date: Date): { startOfQuarter: Date; endOfQuarter: Date } {
    const year = date.getFullYear();
    const month = date.getMonth();
    const quarterStartMonth = Math.floor(month / 3) * 3;
    const startOfQuarter = new Date(year, quarterStartMonth, 1);

    const quarterEndMonth = quarterStartMonth + 2;
    const endOfQuarter = new Date(year, quarterEndMonth + 1, 0);
    endOfQuarter.setHours(23, 59, 59, 999);

    return { startOfQuarter, endOfQuarter };
}

/**
 * Calculates the start and end dates of the semester (6-month block) for a given date.
 * 
 * @param date - The target date to evaluate.
 * @returns An object containing the startOfSemester and endOfSemester Date objects.
 */
export function getSemesterRange(date: Date): { startOfSemester: Date; endOfSemester: Date } {
    const year = date.getFullYear();
    const month = date.getMonth();
    const semesterStartMonth = Math.floor(month / 6) * 6;
    const startOfSemester = new Date(year, semesterStartMonth, 1);

    const semesterEndMonth = semesterStartMonth + 5;
    const endOfSemester = new Date(year, semesterEndMonth + 1, 0);
    endOfSemester.setHours(23, 59, 59, 999);

    return { startOfSemester, endOfSemester };
}

/**
 * Calculates the very first and very last millisecond of the year for a given date.
 * 
 * @param date - The target date to evaluate.
 * @returns An object containing the startOfYear and endOfYear Date objects.
 */
export function getYearRange(date: Date): { startOfYear: Date; endOfYear: Date } {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0);
    const endOfYear = new Date(year, 12, 0, 23, 59, 59, 999);

    return { startOfYear, endOfYear };
}

/**
 * Converts a native JavaScript Date object into a "YYYY-MM-DD" string format.
 * 
 * @param dateObj - The Date object to format.
 * @returns A string representing the date (e.g., "2023-10-15").
 */
export function formattingDateObj(dateObj: Date): string {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const date = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${date}`;
}

/**
 * Converts a UNIX timestamp (in seconds) into a "YYYY-MM-DD" formatted string.
 * 
 * @param unixSeconds - The UNIX timestamp in seconds.
 * @returns A string representing the date (e.g., "2023-10-15").
 */
export function unixToYYYYMMDD(unixSeconds: number): string {
    // Multiply by 1000 to convert seconds to milliseconds for the JS Date object
    const dateObj = new Date(unixSeconds * 1000);

    const year = dateObj.getFullYear();
    // getMonth() is 0-indexed (January is 0), so we add 1
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const date = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${date}`;
}

/**
 * Converts a UNIX timestamp (in seconds) into a "MMM DD" formatted string.
 * 
 * @param unixSeconds - The UNIX timestamp in seconds.
 * @returns A string representing the date (e.g., "Nov 21").
 */
export function unixToMMMDD(unixSeconds: number): string {
    const dateObj = new Date(unixSeconds * 1000);

    const date = dateObj.getDate();
    const month = shortMonthNames[dateObj.getMonth()];

    return `${month} ${date}`;
}
