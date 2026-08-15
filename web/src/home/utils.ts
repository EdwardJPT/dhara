import { Task, UnsortedTask } from "./types";
import {
    ALL,
    TaskFiltersPriority,
    TaskFiltersStatus,
    TaskFiltersTime,
    getWeekRange,
    getMonthRange,
    getQuarterRange,
    monthNames,
} from "../components/constants";
import { TaskFilters } from "./home";

function isContainMonthsName(str: string) {
    return monthNames.includes(str.split(" ")[0]);
}

export function filterTasks(tasks: Task[], filters: TaskFilters, todayStr: string): Task[] {
    let result = tasks;
    const todayDate = new Date(todayStr);

    // filter based on priority
    if (filters.priority !== TaskFiltersPriority.ALL) {
        result = result.filter((t) => t.priority);
    }

    // filter based on selected project
    if (filters.selectedProject !== ALL && Number.isFinite(filters.selectedProject)) {
        result = result.filter((t) => t.project_id === filters.selectedProject);
    }

    // filter based on finish status
    if (filters.status !== TaskFiltersStatus.ALL) {
        if (filters.status === TaskFiltersStatus.Unfinished) {
            result = result.filter((t) => !t.is_done);
        } else if (filters.status === TaskFiltersStatus.Finished) {
            result = result.filter((t) => t.is_done);
        } else if (filters.status === TaskFiltersStatus.Overdue) {
            result = result.filter((t) => !t.is_done && todayDate > new Date(t.due_date));
        }
    }

    // filter based on time range
    if (filters.time !== ALL) {
        result = result.filter((t) => {
            const taskDueDate = new Date(t.due_date);

            if (filters.time === TaskFiltersTime.Today) {
                return t.due_date === todayStr;
            }
            if (filters.time === TaskFiltersTime.ThisWeek) {
                const { startOfWeek, endOfWeek } = getWeekRange(todayDate);
                return taskDueDate >= startOfWeek && taskDueDate <= endOfWeek;
            }
            if (filters.time === TaskFiltersTime.SevenDays) {
                const thisDay = new Date(todayStr);
                const next7DaysEnd = new Date(todayStr);
                next7DaysEnd.setDate(thisDay.getDate() + 6);
                next7DaysEnd.setHours(23, 59, 59, 999);
                return taskDueDate >= thisDay && taskDueDate <= next7DaysEnd;
            }
            if (filters.time === TaskFiltersTime.ThisMonth) {
                const { startOfMonth, endOfMonth } = getMonthRange(todayDate);
                return taskDueDate >= startOfMonth && taskDueDate <= endOfMonth;
            }
            if (filters.time === TaskFiltersTime.ThirtyDays) {
                const thisDay = new Date(todayStr);
                const next30DaysEnd = new Date(todayStr);
                next30DaysEnd.setDate(thisDay.getDate() + 29);
                next30DaysEnd.setHours(23, 59, 59, 999);
                return taskDueDate >= thisDay && taskDueDate <= next30DaysEnd;
            }
            if (filters.time === TaskFiltersTime.ThisQuarter) {
                const { startOfQuarter, endOfQuarter } = getQuarterRange(todayDate);
                return taskDueDate >= startOfQuarter && taskDueDate <= endOfQuarter;
            }
            if (isContainMonthsName(filters.time)) {
                const monthStr = filters.time.split(" ")[0];
                const month = monthNames.indexOf(monthStr);
                const year = Number(filters.time.split(" ")[1]);
                return taskDueDate >= new Date(year, month) && taskDueDate <= new Date(year, month + 1);
            }
            // filter for clicking the calendar (specific date string)
            if (filters.time) {
                return t.due_date === filters.time;
            }
            return false;
        });
    }

    return result;
}

// DEMO HELPERS

export function convertToTask(unsorted: UnsortedTask, projectId: number, newTaskId?: number): Task {
    // Extract the mismatched fields, and group the identical ones into 'commonProps'
    const {
        unsorted_id,
        unsorted_title,
        unsorted_desc,
        ...commonProps
    } = unsorted;
    // Return the newly shaped Task object
    return {
        ...commonProps,
        task_id: newTaskId ?? unsorted_id,
        project_id: projectId,
        task_title: unsorted_title,
        task_desc: unsorted_desc,
    };
}
