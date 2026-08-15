import { Signal } from "@preact/signals";

import { UnsortedTask } from "./types";
import { formattingDateObj } from "../components/constants";

interface UnsortedDetailsProps {
  unsortedSignal: Signal<UnsortedTask | null>;
}

export function UnsortedDetails({ unsortedSignal }: UnsortedDetailsProps) {
  // If this component is called, the value of unsortedSignal won't ever be null
  // we do it to please typescript
  const unsorted = unsortedSignal.value ?? ({} as UnsortedTask);

  return (
    <div
      class="fixed top-1/2 left-1/2 z-11 h-9/10 w-9/10 -translate-1/2 rounded-xl border border-background bg-white shadow-lg md:h-fit md:max-w-2xl"
    >
      <div class="flex h-1/10 items-center justify-start rounded-t-xl bg-linear-to-r from-hover to-background p-5">
        <h2 class="text-2xl font-bold text-white">Unsorted Details</h2>
      </div>
      <span
        class="absolute top-5 right-5 cursor-pointer text-2xl font-extrabold text-white"
        onClick={() => (unsortedSignal.value = null)}
      >
        &#x2715;
      </span>
      <div class="p-6">

        <div class="grid grid-cols-1 gap-2">
          {/* Unsorted Title */}
          <div class="mb-4">
            <label
              class="mb-2 block text-sm font-bold text-gray-700"
              for="unsorted_title"
            >
              Unsorted Title
            </label>
            <input
              type="text"
              id="unsorted_title"
              name="unsorted_title"
              value={unsorted.unsorted_title}
              disabled
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Unsorted Description */}
          <div class="mb-4">
            <label
              class="mb-2 block text-sm font-bold text-gray-700"
              for="unsorted_desc"
            >
              Unsorted Description
            </label>
            <input
              type="text"
              id="unsorted_desc"
              name="unsorted_desc"
              value={unsorted.unsorted_desc}
              disabled
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Priority Toggle */}
          <div class="mb-4 flex items-center justify-between rounded-md bg-gray-100 p-3">
            <label class="text-base font-medium text-gray-700">
              Priority
            </label>
            <div class="flex items-center">
              <span class="mr-2 text-sm text-gray-500">No</span>
              <button
                type="button"
                class={`relative inline-flex h-6 w-11 items-center rounded-full transition 
                      ${unsorted.priority ? "bg-background" : "bg-gray-400"}`}
                disabled
              >
                <span
                  class={`inline-block h-4 w-4 transform rounded-full bg-white transition ease-in-out
                    ${unsorted.priority ? "translate-x-6" : "translate-x-1"}`}
                ></span>
              </button>
              <span class="ml-2 text-sm text-gray-500">Yes</span>
            </div>
          </div>

          {/* Due Date */}
          <div class="mb-4">
            <label
              class="mb-2 block text-sm font-bold text-gray-700"
              for="unsorted_due_date"
            >
              Due Date
            </label>
            <input
              type="date"
              id="unsorted_due_date"
              name="unsorted_due_date"
              value={unsorted.due_date}
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled
            />
          </div>

          {/* Completion */}
          <div class="mb-4">
            {unsorted.is_done && (
              <div class="mt-2">
                <label
                  class="mb-2 block text-sm font-bold text-gray-700"
                  for="unsorted_done_date"
                >
                  Completion Date
                </label>
                <input
                  type="date"
                  id="unsorted_done_date"
                  name="unsorted_done_date"
                  value={formattingDateObj(new Date(unsorted.done_date * 1000))}
                  class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
