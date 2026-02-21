import React from "react";

export default function TaskItem({ task, onDelete }) {
  return (
    <li className="taskItem">
      {/* TODO (Task 2): show the task text inside the <span> */}
      {/* Example: task.text */}
      <span></span>

      {/* TODO (Task 3): add onClick handler to Delete button */}
      {/* When clicked, call onDelete(task.id) */}
      <button className="btn btn--danger">
        Delete
      </button>
    </li>
  );

}

