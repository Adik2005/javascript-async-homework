// ==============================
// TASKS WITH CLOSURES
// ==============================

function createTask(name) {
  let count = 0;

  function run() {
    count++;

    const startTime = performance.now();
    const delay = Math.floor(Math.random() * 1501) + 500;

    updateTaskUI(name, "Loading...", count, "-");

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const loadingTime = Math.round(performance.now() - startTime);

        // About 25% chance of failure
        const failed = Math.random() < 0.25;

        if (failed) {
          updateTaskUI(name, "Failed", count, `${loadingTime} ms`);

          reject({
            name,
            status: "Failed",
            loadingTime
          });
        } else {
          updateTaskUI(name, "Completed", count, `${loadingTime} ms`);

          resolve({
            name,
            status: "Completed",
            loadingTime
          });
        }
      }, delay);
    });
  }

  function getCount() {
    return count;
  }

  function reset() {
    count = 0;
    updateTaskUI(name, "Ready", count, "-");
  }

  return {
    name,
    run,
    getCount,
    reset
  };
}


// ==============================
// CREATE TASKS
// ==============================

const loadUsersTask = createTask("Load Users");
const loadPostsTask = createTask("Load Posts");
const loadCommentsTask = createTask("Load Comments");

const tasks = [
  loadUsersTask,
  loadPostsTask,
  loadCommentsTask
];


// ==============================
// CREATE TASK CARDS
// ==============================

const tasksContainer = document.getElementById("tasks-container");

tasks.forEach(task => {
  const taskId = task.name.toLowerCase().replaceAll(" ", "-");

  tasksContainer.innerHTML += `
    <div class="task-card" id="${taskId}">
      <h3>${task.name}</h3>

      <p>
        <strong>Status:</strong>
        <span class="task-status">Ready</span>
      </p>

      <p>
        <strong>Execution count:</strong>
        <span class="task-count">0</span>
      </p>

      <p>
        <strong>Loading time:</strong>
        <span class="task-time">-</span>
      </p>

      <button class="run-task-btn">
        Run Task
      </button>

      <button class="reset-task-btn">
        Reset
      </button>
    </div>
  `;
});


// ==============================
// UPDATE UI
// ==============================

function updateTaskUI(name, status, count, time) {
  const taskId = name.toLowerCase().replaceAll(" ", "-");

  const card = document.getElementById(taskId);

  card.querySelector(".task-status").textContent = status;
  card.querySelector(".task-count").textContent = count;
  card.querySelector(".task-time").textContent = time;

  card.dataset.status = status;
}


// ==============================
// INDIVIDUAL BUTTONS
// ==============================

tasks.forEach(task => {
  const taskId = task.name.toLowerCase().replaceAll(" ", "-");

  const card = document.getElementById(taskId);

  const runButton = card.querySelector(".run-task-btn");
  const resetButton = card.querySelector(".reset-task-btn");

  runButton.addEventListener("click", async () => {
    try {
      const result = await task.run();

      console.log(
        `${result.name} ${result.status} in ${result.loadingTime} ms`
      );
    } catch (error) {
      console.log(
        `${error.name} ${error.status} in ${error.loadingTime} ms`
      );
    }
  });

  resetButton.addEventListener("click", () => {
    task.reset();
  });
});


// ==============================
// RUN ALL TASKS
// ==============================

const runAllButton = document.getElementById("run-all-btn");
const allStatus = document.getElementById("all-status");

runAllButton.addEventListener("click", async () => {
  allStatus.textContent = "Running all tasks...";

  const startTime = performance.now();

  // allSettled waits for both completed and failed Promises
  const results = await Promise.allSettled(
    tasks.map(task => task.run())
  );

  const totalTime = Math.round(
    performance.now() - startTime
  );

  allStatus.textContent =
    `All tasks finished in ${totalTime} ms`;

  console.log("All task results:", results);
});