import { useComputed, Signal } from "@preact/signals";
import {
    getMonthRange,
    getQuarterRange,
    getSemesterRange,
    getWeekRange,
    getYearRange,
    ReportsTimeRange,
    todayUserTimeZone,
} from "../components/constants";

export type TimeRangeType = typeof ReportsTimeRange[keyof typeof ReportsTimeRange];

export function useDateRange(timeRange: Signal<TimeRangeType>) {
    return useComputed(() => {
        const today = todayUserTimeZone();
        let start = new Date(-8640000000000000);
        let end = new Date(8640000000000000);

        switch (timeRange.value) {
            case ReportsTimeRange.ThisWeek: {
                const { startOfWeek, endOfWeek } = getWeekRange(new Date(today));
                start = startOfWeek;
                end = endOfWeek;
                break;
            }
            case ReportsTimeRange.ThisMonth: {
                const { startOfMonth, endOfMonth } = getMonthRange(new Date(today));
                start = startOfMonth;
                end = endOfMonth;
                break;
            }
            case ReportsTimeRange.ThreeMonths: {
                const { startOfQuarter, endOfQuarter } = getQuarterRange(new Date(today));
                start = startOfQuarter;
                end = endOfQuarter;
                break;
            }
            case ReportsTimeRange.SixMonths: {
                const { startOfSemester, endOfSemester } = getSemesterRange(new Date(today));
                start = startOfSemester;
                end = endOfSemester;
                break;
            }
            case ReportsTimeRange.SevenDays: {
                const thisDay = new Date(today);
                const last7Days = new Date(today);
                last7Days.setDate(thisDay.getDate() - 6);
                thisDay.setHours(23, 59, 59, 999);
                last7Days.setHours(0, 0, 0, 0);
                start = last7Days;
                end = thisDay;
                break;
            }
            case ReportsTimeRange.ThirtyDays: {
                const thisDay = new Date(today);
                const last30Days = new Date(today);
                last30Days.setDate(thisDay.getDate() - 29);
                thisDay.setHours(23, 59, 59, 999);
                last30Days.setHours(0, 0, 0, 0);
                start = last30Days;
                end = thisDay;
                break;
            }
            case ReportsTimeRange.NinetyDays: {
                const thisDay = new Date(today);
                const last90Days = new Date(today);
                last90Days.setDate(thisDay.getDate() - 89);
                thisDay.setHours(23, 59, 59, 999);
                last90Days.setHours(0, 0, 0, 0);
                start = last90Days;
                end = thisDay;
                break;
            }
            case ReportsTimeRange.HundredEightyDays: {
                const thisDay = new Date(today);
                const last180Days = new Date(today);
                last180Days.setDate(thisDay.getDate() - 179);
                thisDay.setHours(23, 59, 59, 999);
                last180Days.setHours(0, 0, 0, 0);
                start = last180Days;
                end = thisDay;
                break;
            }
            case ReportsTimeRange.ThisYear: {
                const { startOfYear, endOfYear } = getYearRange(new Date(today));
                start = startOfYear;
                end = endOfYear;
                break;
            }
        }

        return { start, end };
    });
}
