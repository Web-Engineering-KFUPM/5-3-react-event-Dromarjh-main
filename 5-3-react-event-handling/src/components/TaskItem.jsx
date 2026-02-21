import React from "react";

export default function TaskItem({ task, onDelete }) {
  return (
    <li className="item">
      {/* TODO (Task 2): render task text */}
      <span className="item__text">{/* task.text */}</span>

      <div className="item__actions">
        <button
          className="iconBtn iconBtn--danger"
          aria-label="Delete task"
          title="Delete"
          // TODO (Task 3): call onDelete(task.id) when clicked
          // onClick={() => onDelete(task.id)}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}