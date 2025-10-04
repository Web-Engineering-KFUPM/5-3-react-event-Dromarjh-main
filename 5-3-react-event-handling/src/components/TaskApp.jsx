import React from "react";
import TaskList from "./TaskList";

export default function TaskApp() {
  // Simple refs by id (no React state used)
  const handleChange = (e) => {
    // TODO 1: Add onChange to capture current text
    // Show the currently typed text under the input
    const preview = document.getElementById("typedPreview");
    if (preview) preview.textContent = e.target.value || "";
  };

  const handleSubmit = () => {
    // TODO 2: Add onClick to submit the text and pass it as props to TaskList
    // Since we aren't using state yet, we'll append to the list imperatively.
    const input = document.getElementById("taskInput");
    const list = document.getElementById("taskList");
    const text = (input?.value || "").trim();
    if (!text || !list) return;

    // Create <li> like <TaskItem /> would render
    const li = document.createElement("li");
    li.className = "item";

    const span = document.createElement("span");
    span.className = "item__text";
    span.textContent = text;

    const actions = document.createElement("div");
    actions.className = "item__actions";

    const btn = document.createElement("button");
    btn.className = "iconBtn iconBtn--danger";
    btn.setAttribute("aria-label", "Delete task");
    btn.title = "Delete";
    btn.textContent = "🗑️";

    // TODO 3: Add onClick to delete this task from screen
    btn.addEventListener("click", () => {
      list.removeChild(li);
      // If the list becomes empty, show the placeholder again
      ensurePlaceholder();
    });

    actions.appendChild(btn);
    li.appendChild(span);
    li.appendChild(actions);
    list.appendChild(li);

    // Clear input + preview
    input.value = "";
    const preview = document.getElementById("typedPreview");
    if (preview) preview.textContent = "";

    // Remove placeholder if present
    removePlaceholder();
  };

  const handleClearAll = () => {
    // TODO 4: Add onClick to clear all tasks from the screen
    const list = document.getElementById("taskList");
    if (!list) return;
    list.innerHTML = "";
    ensurePlaceholder();
  };

  // Helpers to manage the placeholder line
  const removePlaceholder = () => {
    const ph = document.getElementById("listPlaceholder");
    if (ph && ph.parentElement) ph.parentElement.removeChild(ph);
  };
  const ensurePlaceholder = () => {
    const list = document.getElementById("taskList");
    if (!list) return;
    const hasItems = list.querySelector(".item");
    if (!hasItems) {
      const ph = document.createElement("li");
      ph.id = "listPlaceholder";
      ph.className = "list__placeholder";
      ph.textContent = "Your tasks will appear here after Submit.";
      list.appendChild(ph);
    }
  };

  return (
    <section className="card">
      {/* Input Row */}
      <div className="inputRow">
        <input
          id="taskInput"
          type="text"
          placeholder="Type a task…"
          className="input"
          // TODO 1: Add onChange to capture current text
          onChange={handleChange}
        />
        <button
          className="btn btn--primary"
          // TODO 2: Add onClick to submit the text and pass it as props to TaskList
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      {/* Live preview for Task 1 */}
      <div id="typedPreview" className="muted" aria-live="polite"></div>

      {/* Task List */}
      <TaskList
        // TODO 2: Pass submitted task(s) as props here
        // (Prop mapping will be taught with state later; for now we append imperatively.)
      />

      {/* Clear All */}
      <div className="footerRow">
        <button
          className="btn btn--ghost"
          // TODO 4: Add onClick to clear all tasks from the screen
          onClick={handleClearAll}
        >
          Clear All
        </button>
      </div>
    </section>
  );
}
