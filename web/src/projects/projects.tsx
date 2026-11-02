import { render } from "preact";
import { useSignal, useSignalEffect } from "@preact/signals";

import { ProjectsDisplay } from "./projects.display";
import { NewGoalForm } from "./projects.goalForm";
import type { Project } from "../models";
import type { Goal } from "../home/types";

interface BackEndData {
  projectList: Project[];
  goalList: Goal[];
  isDemo: boolean;
}

function App({ projectList, goalList, isDemo = false }: BackEndData) {
  const loadProjects = (): Project[] => {
    const stored = isDemo ? localStorage.getItem("demo_projects") : null;
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing demo_projects", e);
      }
    }
    return projectList;
  };
  const projects = useSignal(loadProjects());
  const loadGoals = (): Goal[] => {
    const stored = isDemo ? localStorage.getItem("demo_goals") : null;
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing demo_goals", e);
      }
    }
    return goalList;
  };
  const goals = useSignal(loadGoals());
  useSignalEffect(() => {
    const currentGoals = goals.value;
    if (isDemo) {
      localStorage.setItem("demo_goals", JSON.stringify(currentGoals));
    }
  });
  const selectedGoalId = useSignal(goals.value.length ? String(goals.value[0].goal_id) : "new");
  const showGoalForm = useSignal(false);

  return (
    <div class="mx-auto w-full min-w-0 max-w-6xl font-sans text-slate-800">

      <div class="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-background/20 pb-6">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-background sm:text-4xl">
            All Projects
          </h1>
          <p class="mt-3 text-sm text-background sm:text-base sm:font-medium">
            Everything you're working on, all in one place.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span class="rounded-xs bg-white px-4 py-2 text-[15px] font-semibold text-background shadow-sm">
            {projects.value.length} {projects.value.length === 1 ? "project" : "projects"}
          </span>
          {goals.value.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (showGoalForm.value && selectedGoalId.value !== "new") {
                  showGoalForm.value = false;
                  return;
                }
                selectedGoalId.value = String(goals.value[0].goal_id);
                showGoalForm.value = true;
              }}
              aria-expanded={showGoalForm.value && selectedGoalId.value !== "new"}
              aria-controls="new-goal-form"
              class="flex cursor-pointer items-center justify-center border border-background bg-white px-3 py-1.75 text-base font-semibold whitespace-nowrap text-background hover:bg-slate-50"
            >
              Manage Goals
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (showGoalForm.value && selectedGoalId.value === "new") {
                showGoalForm.value = false;
                return;
              }
              selectedGoalId.value = "new";
              showGoalForm.value = true;
            }}
            aria-expanded={showGoalForm.value && selectedGoalId.value === "new"}
            aria-controls="new-goal-form"
            class="flex cursor-pointer items-center justify-center bg-background px-3 py-1.75 text-base font-semibold whitespace-nowrap text-white hover:bg-hover"
          >
            + Add Goal
          </button>
        </div>
      </div>

      {showGoalForm.value && (
        <NewGoalForm
          projects={projects}
          goals={goals}
          selectedGoalId={selectedGoalId}
          onClose={() => showGoalForm.value = false}
          isDemo={isDemo}
        />
      )}

      <ProjectsDisplay projects={projects} goals={goals} isDemo={isDemo} />
    </div>
  );
}

interface DataWindow extends Window, BackEndData { }
const dataWindow = window as unknown as DataWindow;

render(
  <App projectList={dataWindow.projectList} goalList={dataWindow.goalList} isDemo={dataWindow.isDemo || false} />,
  document.getElementById("projects")!
);
