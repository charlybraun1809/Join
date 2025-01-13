let taskArray = [];


function init() {
    loadTasks();
    userLog();
}

/**
 * Map Drop-Zone IDs to status names.
 * @param {string} dropZone - The ID of the drop zone.
 * @returns {string} - The corresponding status name.
 */
function mapDropZoneToStatus(dropZone) {
    const dropZoneMap = {
        dropZone1: "toDo",
        dropZone2: "inProgress",
        dropZone3: "awaitFeedback",
        dropZone4: "done",
    };
    return dropZoneMap[dropZone] || "unknown";
}

async function getData(key) {
    const url = "https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/tasks.json";
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function loadTasks() {
    const tasks = await getData("tasks");

    taskArray = [];

    for (const [status, tasksForStatus] of Object.entries(tasks)) {
        for (const taskKey in tasksForStatus) {
            const task = tasksForStatus[taskKey];
            // Map dropZone to status
            task.status = mapDropZoneToStatus(task.dropZone);
            taskArray.push(task);
        }
    }

    renderTask();
}

function renderTask() {
    let taskSection = document.getElementById("sum-sct");
    taskSection.innerHTML = "";

    let totalTaskCount = 0;
    let doneCount = 0;
    let toDoCount = 0;
    let progressCount = 0;
    let feedBackCount = 0;
    let urgentPrio = 0;
    let deadLineField = [];
    let minField = null;

    for (let i = 0; i < taskArray.length; i++) {
        const task = taskArray[i];
        totalTaskCount++;

        if (task.status === "done") {
            doneCount++;
        }
        if (task.status === "toDo") {
            toDoCount++;
        }
        if (task.status === "inProgress") {
            progressCount++;
        }
        if (task.status === "awaitFeedback") {
            feedBackCount++;
        }

        if (task.priority === "urgent") {
            urgentPrio++;
            if (task.date) {
                const parsedDate = Date.parse(task.date);
                if (!isNaN(parsedDate)) {
                    deadLineField.push(parsedDate);
                }
            }
        }
    }

    if (deadLineField.length > 0) {
        minField = new Date(Math.min(...deadLineField));
    }
    const upcomingDeadline = minField
    ? `${minField.getDate().toString().padStart(2, '0')}.${(minField.getMonth() + 1).toString().padStart(2, '0')}.${minField.getFullYear()}`
    : "No deadlines";

    taskSection.innerHTML += generateSummaryHTML(
        toDoCount,
        doneCount,
        urgentPrio,
        upcomingDeadline,
        totalTaskCount,
        progressCount,
        feedBackCount
    );
}

