# JavaScript Runtime and Async

A small JavaScript project created to practice:

- Closures
- Call Stack
- Promises
- async/await
- Event Loop
- Tasks and Microtasks
- Sequential and concurrent execution

The project uses only HTML, CSS and vanilla JavaScript.

## 1. Closure and Private Counter

Each task is created using `createTask()`.

The execution counter is stored inside the function:

```js
function createTask(name) {
  let count = 0;
}


The count variable cannot be accessed directly from outside the function.

Each task has its own private counter because every call to createTask() creates a new closure.

Example:

const loadUsersTask = createTask("Load Users");
const loadPostsTask = createTask("Load Posts");

Changing the counter of Load Users does not change the counter of Load Posts.

2. Call Stack

JavaScript executes synchronous code using the Call Stack.

For example, in the Event Loop demo:

console.log("Start");
asyncExample();
console.log("End");

The synchronous code runs first.

That is why:

Start
Async function start
End

appears before Promise callbacks and timers.

3. setTimeout

setTimeout() does not block JavaScript.

While a timer is waiting, JavaScript can continue executing other code.

When the timer finishes, its callback is placed in the Task Queue and waits until the Call Stack and Microtask Queue are empty.

4. Event Loop Prediction

Before running the demo, I predicted this output:

Start
Async function start
End
Promise 1
Async function after await
Promise 2
Timer 1
Timer 2

The actual output was the same.

Promise callbacks and code after await are microtasks, so they execute before setTimeout() callbacks.

5. Tasks and Microtasks

Microtasks include:

Promise .then() callbacks
code after await

Tasks include:

setTimeout() callbacks
other timer and browser events

After synchronous code finishes, JavaScript processes the Microtask Queue before timer tasks.

The order can be described as:

Call Stack → Microtask Queue → Task Queue → Event Loop
6. Multiple Promises and Errors

The tasks use Promises to simulate asynchronous loading.

Some tasks randomly fail.

For running multiple tasks at the same time I use:

Promise.allSettled()

Unlike Promise.all(), Promise.allSettled() waits for every Promise even if some of them reject.

This allows the application to display:

All tasks finished

only after every task has either completed or failed.

7. Sequential vs Concurrent Execution

Sequential execution waits for every task before starting the next one:

await task1.run();
await task2.run();
await task3.run();

The total execution time is approximately the sum of all task times.

Concurrent execution starts all tasks almost at the same time:

Promise.allSettled([
  task1.run(),
  task2.run(),
  task3.run()
]);

The total execution time is usually close to the duration of the slowest task.

Because of this, concurrent execution is usually much faster.

Technologies
HTML
CSS
Vanilla JavaScript