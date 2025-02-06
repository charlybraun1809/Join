function getAddTaskOverlayTemplate(categories = []) {
    let categoryOptions = categories
        .map(category => `<option value="${category}">${category}</option>`)
        .join("");

    return `
        <div class="overlayContent">
            <h2>Add New Task</h2>
            <form id="addTaskForm">
                <label for="taskTitle">Task Title:</label>
                <input type="text" id="taskTitle" name="taskTitle" placeholder="Enter task title" required>

                <label for="taskCategory">Category:</label>
                <select id="taskCategory" name="taskCategory">
                    ${categoryOptions}
                </select>

                <label for="taskDescription">Task Description:</label>
                <textarea id="taskDescription" name="taskDescription" placeholder="Enter task description"></textarea>

                <button type="submit">Add Task</button>
            </form>
            <button id="closeAddTaskOverlay">Close</button>
        </div>
    `;
}
