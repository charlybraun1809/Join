function getTaskOverlayTemplate(task) {
    return `
        <div id="overlayWrapper">
            <div class="overlayHeader">
                <span class="overlayTaskCat">${task.title}</span>
                <img src="assets/icons/crossOverlay.png" onclick="hideTaskOverlay()" alt="Close">
            </div>
            <div class="overlayBody">
                <span class="overlayDescription">${task.description}</span>
                <!-- Weitere Inhalte wie Subtasks -->
            </div>
        </div>
    `;
}
