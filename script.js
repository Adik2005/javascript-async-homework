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

// ==============================
// SEQUENTIAL VS CONCURRENT
// ==============================

const runSequentialButton = document.getElementById("run-sequential-btn");
const runConcurrentButton = document.getElementById("run-concurrent-btn");
const comparisonOutput = document.getElementById("comparison-output");

runSequentialButton.addEventListener("click", async () => {
  comparisonOutput.innerHTML = `
    <p>Running sequentially...</p>
  `;

  const startTime = performance.now();

  const results = [];

  for (const task of tasks) {
    try {
      const result = await task.run();
      results.push(result);
    } catch (error) {
      results.push(error);
    }
  }

  const totalTime = Math.round(
    performance.now() - startTime
  );

  comparisonOutput.innerHTML = `
    <h3>Sequential Result</h3>

    <p>
      <strong>Total time:</strong>
      ${totalTime} ms
    </p>

    <p>
      Tasks run one after another.
      The next task starts only after the previous one finishes.
    </p>
  `;

  console.log("Sequential results:", results);
});


runConcurrentButton.addEventListener("click", async () => {
  comparisonOutput.innerHTML = `
    <p>Running concurrently...</p>
  `;

  const startTime = performance.now();

  const results = await Promise.allSettled(
    tasks.map(task => task.run())
  );

  const totalTime = Math.round(
    performance.now() - startTime
  );

  comparisonOutput.innerHTML = `
    <h3>Concurrent Result</h3>

    <p>
      <strong>Total time:</strong>
      ${totalTime} ms
    </p>

    <p>
      All tasks start almost at the same time.
      The total time is usually close to the slowest single task.
    </p>
  `;

  console.log("Concurrent results:", results);
});

// ==============================
// EVENT LOOP DEMO
// ==============================

const eventLoopButton = document.getElementById("event-loop-btn");
const expectedOutput = document.getElementById("expected-output");
const actualOutput = document.getElementById("actual-output");
const eventLoopExplanation = document.getElementById(
  "event-loop-explanation"
);

const expectedLines = [
  "Start",
  "Async function start",
  "End",
  "Promise 1",
  "Async function after await",
  "Promise 2",
  "Timer 1",
  "Timer 2"
];

expectedOutput.textContent = expectedLines.join("\n");

eventLoopButton.addEventListener("click", async () => {
  const output = [];

  function log(message) {
    output.push(message);
    console.log(message);

    actualOutput.textContent = output.join("\n");
  }

  actualOutput.textContent = "";
  eventLoopExplanation.innerHTML = "";

  log("Start");

  setTimeout(() => {
    log("Timer 1");
  }, 0);

  Promise.resolve().then(() => {
    log("Promise 1");
  });

  async function asyncExample() {
    log("Async function start");

    await Promise.resolve();

    log("Async function after await");
  }

  asyncExample();

  Promise.resolve().then(() => {
    log("Promise 2");
  });

  setTimeout(() => {
    log("Timer 2");
  }, 0);

  log("End");

  setTimeout(() => {
    eventLoopExplanation.innerHTML = `
      <h3>Why this order happens</h3>

      <p>
        First, all synchronous code runs on the Call Stack.
        That is why "Start", "Async function start", and "End"
        appear before the asynchronous callbacks.
      </p>

      <p>
        Promise callbacks and the continuation after await
        go to the Microtask Queue.
      </p>

      <p>
        setTimeout callbacks go to the Task Queue.
      </p>

      <p>
        After the Call Stack is empty, the Event Loop processes
        all microtasks before moving to timer tasks.
      </p>

      <p>
        <strong>Order:</strong>
        Call Stack → Microtask Queue → Task Queue → Event Loop.
      </p>
    `;
  }, 100);
});