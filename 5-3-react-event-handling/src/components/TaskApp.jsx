import React from "react";
import TaskList from "./TaskList";

export default function TaskApp() {
  return (
    <section className="card">
      {/* Input Row */}
      <div className="inputRow">
        <input
          type="text"
          placeholder="Type a task…"
          className="input"
          // TODO 1: Add onChange to capture current text
        />
        <button
          className="btn btn--primary"
          // TODO 2: Add onClick to submit the text and pass it as props to TaskList
        >
          Submit
        </button>
      </div>

      {/* Task List */}
      <TaskList
        // TODO 2: Pass submitted task(s) as props here
      />

      {/* Clear All */}
      <div className="footerRow">
        <button
          className="btn btn--ghost"
          // TODO 4: Add onClick to clear all tasks from the screen
        >
          Clear All
        </button>
      </div>
    </section>
  );
}
