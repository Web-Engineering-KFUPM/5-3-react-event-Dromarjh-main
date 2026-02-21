import React from "react";

export default function TaskItem({ id, text, onDelete }) {
  return (
    <li className="taskItem">
      {/* Task 2: show the text inside the <span> */}
      <span>{text}</span>

      {/* TODO (Task 3): add onClick handler to Delete button */}
      {/* When clicked, call onDelete(id) */}
      <button
        className="btn btn--danger"
        onClick={() => onDelete(id)}
      >
        Delete
      </button>
    </li>
  );
}

