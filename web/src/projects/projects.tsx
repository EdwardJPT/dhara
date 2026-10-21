import { render } from "preact";
import { useSignal } from "@preact/signals";

import { ProjectsDisplay } from "./projects.display";
import type { Project } from "../models";

interface BackEndData {
  projectList: Project[];
  isDemo: boolean;
}

function App({ projectList, isDemo = false }: BackEndData) {
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
        <span class="rounded-xs bg-white px-4 py-2 text-[15px] font-semibold text-background shadow-sm">
          {projects.value.length} {projects.value.length === 1 ? "project" : "projects"}
        </span>
      </div>

      <ProjectsDisplay projects={projects} isDemo={isDemo} />
    </div>
  );
}

interface DataWindow extends Window, BackEndData { }
const dataWindow = window as unknown as DataWindow;

render(
  <App projectList={dataWindow.projectList} isDemo={dataWindow.isDemo || false} />,
  document.getElementById("projects")!
);
