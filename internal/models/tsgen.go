//go:build ignore

// run it from the root of the project with the command:
// go generate ./...

package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"
	"tasksmanagement/internal/models"

	"github.com/tkrajina/typescriptify-golang-structs/typescriptify"
)

func main() {
	allTypesConvert()
	homeTypesConvert()
	projectTypesConvert()
	habitsTypesConvert()
	calendarTypesConvert()
	reportsTypesConvert()
}

func allTypesConvert() {
	converter := typescriptify.New()

	converter.Add(models.Project{})
	converter.Add(models.Task{})
	converter.Add(models.UnsortedTask{})
	converter.Add(models.HabitsGroupWithHabits{})
	converter.Add(models.HabitWithDoneDates{})

	// Config
	converter.CreateInterface = true
	converter.BackupDir = ""

	// Convert it
	ts, err := converter.Convert(nil)
	if err != nil {
		fmt.Println(err)
	}

	// Write it the file
	pathTarget := "../../web/src/models.ts"
	err = os.WriteFile(pathTarget, []byte(ts), 0644)
	if err != nil {
		panic(err)
	}
}

func homeTypesConvert() {
	home := typescriptify.New()

	// Types for /home feature
	home.Add(models.Project{})
	home.Add(models.Task{})
	home.Add(models.UnsortedTask{})
	home.Add(models.TasksWithProject{})

	home.WithInterface(true) // ← this is required
	home.WithPrefix("export ")
	home.BackupDir = "" // or omit — default is no backup

	// Convert it
	homeTypes, err := home.Convert(nil)
	if err != nil {
		fmt.Println(err)
	}

	homeTypes = convertInterfacesToTypes(homeTypes)

	// Write it the file
	pathTarget := "../../web/src/home/types.ts"
	err = os.WriteFile(pathTarget, []byte(homeTypes), 0644)
	if err != nil {
		panic(err)
	}
}

func projectTypesConvert() {
	project := typescriptify.New()

	// Types for /home feature
	project.Add(models.Project{})
	project.Add(models.Task{})
	project.Add(models.TasksWithProject{})

	project.WithInterface(true) // ← this is required
	project.WithPrefix("export ")
	project.BackupDir = "" // or omit — default is no backup

	// Convert it
	projectTypes, err := project.Convert(nil)
	if err != nil {
		fmt.Println(err)
	}

	projectTypes = convertInterfacesToTypes(projectTypes)

	// Write it the file
	pathTarget := "../../web/src/project/types.ts"
	err = os.WriteFile(pathTarget, []byte(projectTypes), 0644)
	if err != nil {
		panic(err)
	}
}

func habitsTypesConvert() {
	habits := typescriptify.New()

	habits.Add(models.HabitsGroupWithHabits{})
	habits.Add(models.HabitWithDoneDates{})
	habits.Add(models.HabitWithGroup{})

	// Config
	habits.CreateInterface = true
	habits.BackupDir = ""

	// Convert it
	habitsTypes, err := habits.Convert(nil)
	if err != nil {
		fmt.Println(err)
	}

	habitsTypes = convertInterfacesToTypes(habitsTypes)

	// Write it the file
	pathTarget := "../../web/src/habits/types.ts"
	err = os.WriteFile(pathTarget, []byte(habitsTypes), 0644)
	if err != nil {
		panic(err)
	}
}

func calendarTypesConvert() {
	calendar := typescriptify.New()

	// Types for /home feature
	calendar.Add(models.TasksWithProject{})
	calendar.Add(models.UnsortedTask{})
	calendar.Add(models.HabitDoneInfo{})

	calendar.WithInterface(true) // ← this is required
	calendar.WithPrefix("export ")
	calendar.BackupDir = "" // or omit — default is no backup

	// Convert it
	calendarTypes, err := calendar.Convert(nil)
	if err != nil {
		fmt.Println(err)
	}

	calendarTypes = convertInterfacesToTypes(calendarTypes)

	// Write it the file
	pathTarget := "../../web/src/calendar/types.ts"
	err = os.WriteFile(pathTarget, []byte(calendarTypes), 0644)
	if err != nil {
		panic(err)
	}
}

func reportsTypesConvert() {
	reports := typescriptify.New()

	// Types for /home feature
	reports.Add(models.Project{})
	reports.Add(models.Task{})
	reports.Add(models.TaskStats{})
	reports.Add(models.HabitsGroupWithHabits{})
	reports.Add(models.HabitWithDoneDates{})
	reports.Add(models.HabitDoneToday{})
	reports.Add(models.BestWorstReport{})
	reports.Add(models.HabitBestWorstStats{})
	reports.Add(models.HabitStats{})
	reports.Add(models.GroupWithHabitsStats{})
	reports.Add(models.ProductivityPeaks{})
	reports.Add(models.AllPeaksMap{})
	reports.Add(models.MonthlyConsistency{})
	reports.Add(models.DayStats{})
	reports.Add(models.WeeklyConsistency{})

	reports.WithInterface(true) // ← this is required
	reports.WithPrefix("export ")
	reports.BackupDir = "" // or omit — default is no backup

	// Convert it
	reportsTypes, err := reports.Convert(nil)
	if err != nil {
		fmt.Println(err)
	}

	reportsTypes = convertInterfacesToTypes(reportsTypes)

	// Write it the file
	pathTarget := "../../web/src/reports/types.ts"
	err = os.WriteFile(pathTarget, []byte(reportsTypes), 0644)
	if err != nil {
		panic(err)
	}
}

// convertInterfacesToTypes replaces all top-level TypeScript interfaces
// with type aliases, preserving 'export' and 'declare' modifiers.
func convertInterfacesToTypes(ts string) string {
	re := regexp.MustCompile(`export interface export (\w+) {`)
	output := re.ReplaceAllString(ts, `export type $1 = {`)
	output = strings.TrimSpace(output)
	return output
}
