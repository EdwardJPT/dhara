import { Signal } from "@preact/signals";
import {
  formattingDateProject,
  nDaysAgo,
  nDaysAgoDone,
  nDaysLeft,
} from "../utils";

import { Project } from "../home/types";

export function ProjectDisplay({ project }: { project: Signal<Project> }) {
  return (
    <div class="h-fit mx-auto flex w-full flex-col rounded-lg border-l-4 border-background bg-white p-4 shadow hover:bg-pink-50 md:w-3xl md:p-6">
      <div class="mb-2 flex items-center justify-between gap-2">
        <h2
          id="tasksFilterTime"
          class="h-fit min-w-0 flex-1 overflow-hidden text-ellipsis text-nowrap text-left text-xl font-extrabold text-background md:py-3 md:text-2xl"
        >
          {project.value.project_title}
        </h2>

        {(project.value.priority || project.value.hide) && (
          <div class="my-auto flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
            {project.value.priority && (
              <span class="inline-flex max-h-6 w-fit shrink-0 items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 md:p-2 md:text-sm">
                Priority
              </span>
            )}
            {project.value.hide && (
              <span
                title="Hidden from Home and Reports"
                class="inline-flex max-h-6 w-fit shrink-0 items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 md:p-2 md:text-sm"
              >
                Hidden
              </span>
            )}
          </div>
        )}
      </div>

      <div class="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div class="flex flex-col items-center justify-between border border-background p-2">
          <p class="flex flex-row text-center text-sm text-gray-800 md:text-base">
            Start: {formattingDateProject(project.value.start_date)}
          </p>
          <p class="mt-1 flex flex-row items-center text-xs text-hover sm:mt-0 md:text-sm">
            <img
              src="/static/images/clock.svg"
              alt="clock icon"
              class="h-3 w-3"
            />
            &nbsp;
            {nDaysAgo(project.value.start_date)}
          </p>
        </div>

        <div class="flex flex-col items-center justify-between border border-background p-2">
          <p class="flex flex-row text-center text-sm text-gray-800 md:text-base">
            Due:&nbsp;
            {formattingDateProject(project.value.due_date)}
          </p>
          <p class="mt-1 flex flex-row items-center text-xs text-hover sm:mt-0 md:text-sm">
            <img
              src="/static/images/clock.svg"
              alt="clock icon"
              class="h-3 w-3"
            />
            &nbsp;
            {nDaysLeft(project.value.due_date)}
          </p>
        </div>

        {project.value.done_date > 0 && (
          <div class="flex flex-col items-center justify-between border border-background p-2">
            <p class="bg-white text-center text-sm font-extrabold text-gray-800 no-underline opacity-100 md:text-base">
              DONE :{" "}
              {formattingDateProject(
                new Date(project.value.done_date * 1000).toLocaleDateString(
                  "en-CA"
                )
              )}
            </p>
            <p class="mt-1 flex flex-row items-center text-xs text-hover sm:mt-0 md:text-sm">
              <img
                src="/static/images/clock.svg"
                alt="clock icon"
                class="h-3 w-3"
              />
              &nbsp;
              {nDaysAgoDone(project.value.done_date)}
            </p>
          </div>
        )}
      </div>

      <p class="my-2.5 h-fit max-h-32.5 overflow-y-auto text-base text-[#28536a] md:text-lg">
        {project.value.project_desc}
      </p>

      <div class="mt-2.5 flex items-center">
        <div class="mr-2 h-2 w-full bg-slate-200">
          <div
            class="h-full bg-linear-to-r from-blue-400 to-blue-700"
            style={{
              width: `calc(100% * ${project.value.to_dos_done} / ${project.value.to_dos_all})`,
            }}
          ></div>
        </div>
        <span class="ml-2 whitespace-nowrap text-xs font-medium text-gray-700 md:text-sm">
          {project.value.to_dos_done}/{project.value.to_dos_all}
        </span>
      </div>
    </div>
  );
}
