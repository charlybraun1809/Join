function generateSummaryHTML(toDoCount, doneCount, urgentPrio, upcomingDeadline, totalTaskCount, progressCount, feedBackCount) {
    return /*html*/`
        <section class="main-content">
            <div class="hero-smry">
                <h1>Join 360</h1>
                <div class="divider-desktop"></div>
                <h3 class="subheading">Key Metrics at a Glance</h3>
                <div class="divider"></div>
            </div>
            <div class="metrics-grid">
                <div class="task-plan-metric">
                    <a href="./boardMobile.html" class="metric">
                        <img src="./assets/icons/todo.png" class="img-top" alt="To-do Icon" style="width: 42px; height: 42px;">
                        <img src="./assets/icons/todowhite.png" class="img-back" alt="To-do Icon">
                        <div class="metric-text">
                            <h2 class="st-number">${toDoCount}</h2>
                            <div>To-do</div>
                        </div>
                    </a>
                    <a href="./boardMobile.html" class="metric">
                        <img src="./assets/icons/done.png" class="img-top" alt="Done Icon" style="width: 42px; height: 42px;">
                        <img src="./assets/icons/donewhite.png" class="img-back" alt="Done Icon">
                        <div class="metric-text">
                            <h2 class="st-number">${doneCount}</h2>
                            <div>Done</div>
                        </div>
                    </a>
                </div>
                <a href="./boardMobile.html" class="metric-wide">
                    <div class="metric-wide-img">
                        <img src="./assets/icons/urgentsum.png" alt="Urgent Icon">
                        <div class="urgent-section">
                            <h2 class="st-number">${urgentPrio}</h2>
                            <div>Urgent</div>
                        </div>
                    </div>
                    <div class="divider-metric"></div>
                    <div class="deadline-section">
                        <h3>${upcomingDeadline}</h3>
                        <h5>Upcoming Deadline</h5>
                    </div>
                </a>                
                <div class="tasks">
                    <a href="./boardMobile.html" class="metric-sm">
                        <h2 class="st-number">${totalTaskCount}</h2>
                        <div class="metric-sm-text" style="flex-wrap: wrap; white-space: normal;">Tasks in Board</div>
                    </a>
                    <a href="./boardMobile.html" class="metric-sm">
                        <h2 class="st-number">${progressCount}</h2>
                        <div class="metric-sm-text">Tasks In Progress</div>
                    </a>
                    <a href="./boardMobile.html" class="metric-sm">
                        <h2 class="st-number">${feedBackCount}</h2>
                        <div class="metric-sm-text">Awaiting Feedback</div>
                    </a>
                </div>
            </div>
        </section>
        <div class="greeting-container" id="greeting-container">
                <span class="greet-text" id="greetText">Good afternoon,</span>
                <span class="greet-username" id="greetUserName" style="white-space: nowrap;">Vorname Nachname</span>
            </div>
            <div id="fullscreenGreeting" class="fullscreen-greeting">
                <span id="fullscreenGreetText"></span>
                <span id="fullscreenGreetUserName"></span>
            </div>
    </div>
    `;
}