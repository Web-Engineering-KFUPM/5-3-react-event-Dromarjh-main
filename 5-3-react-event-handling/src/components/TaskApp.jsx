import React, { useState } from "react";
import TaskList from "./TaskList";

export default function TaskApp() {
  // Task 1: state for controlled input
  const [text, setText] = useState("");

  // Task 2: state for tasks list
  const [tasks, setTasks] = useState([]);

  const handleSubmit = () => {
    // TODO (Task 2):
    // 1) prevent empty submit using text.trim()
    // 2) add new task object { id, text } into tasks (immutably)
    // 3) clear input (setText(""))
  };

  const handleDelete = (id) => {
    // TODO (Task 3): remove task by id using filter (immutably)
  };

  const handleClearAll = () => {
    // TODO (Task 4): setTasks([])
  };

  return (
    <section className="card">
      <div className="inputRow">
        <input
          type="text"
          placeholder="Type a task..."
          className="input"
          // TODO (Task 1): make this a controlled input:
          // value={text}
          // onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <button className="btn btn--primary" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* TODO (Task 1): display the current text below the input */}
      {/* <p>{text}</p> */}

      {/* Pass tasks and onDelete to TaskList */}
      <TaskList tasks={tasks} onDelete={handleDelete} />

      <div className="footerRow">
        <button className="btn btn--ghost" onClick={handleClearAll}>
          Clear All
        </button>
      </div>
    </section>
  );
}