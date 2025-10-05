import React, { useState } from "react";
import TaskList from "./TaskList";

export default function TaskApp() {
  // ------------------------------------------------------------
  // Task 1 – Capture Input using State
  // ------------------------------------------------------------
  // TODO: create text state, e.g., const [text, setText] = useState("");
  // TODO: bind to <input value={text} onChange={...} />

  // ------------------------------------------------------------
  // Task 2 – Create Array State to Store Tasks
  // ------------------------------------------------------------
  // TODO: create tasks state array, e.g., const [tasks, setTasks] = useState([]);

  // ------------------------------------------------------------
  // Task 2 – Handle Submit (Add Task)
  // ------------------------------------------------------------
  const handleSubmit = () => {
    // TODO:
    // 1) trim text
    // 2) if empty, return
    // 3) add { id: Date.now(), text } to tasks IMMUTABLY
    // 4) clear input
  };

  // ------------------------------------------------------------
  // Task 3 – Handle Delete (Remove One Task)
  // ------------------------------------------------------------
  const handleDelete = (id) => {
    // TODO: filter tasks by id to remove the clicked one
  };

  // ------------------------------------------------------------
  // Task 4 – Handle Clear All (Remove All Tasks)
  // ------------------------------------------------------------
  const handleClearAll = () => {
    // TODO: set tasks to empty array
  };

  return (
    <section className="card">
      {/* Task 1 – Controlled Input */}
      <div className="inputRow">
        <input
          type="text"
          placeholder="Type a task..."
          className="input"
          // TODO: value={text}
          // TODO: onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <button className="btn btn--primary" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* Task 2 & 3 – Render Task List and Enable Delete */}
      {/* TODO: pass tasks and onDelete */}
      <TaskList /* tasks={tasks} onDelete={handleDelete} */ />

      {/* Task 4 – Clear All */}
      <div className="footerRow">
        <button className="btn btn--ghost" onClick={handleClearAll}>
          Clear All
        </button>
      </div>
    </section>
  );
}
