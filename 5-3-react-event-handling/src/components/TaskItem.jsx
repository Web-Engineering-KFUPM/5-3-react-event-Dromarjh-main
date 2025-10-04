import React from "react";

export default function TaskItem(props) {
  return (
    <li className="item">
      {/* TODO 2: Display task text from props */}
      <span className="item__text">{props.text}</span>

      <div className="item__actions">
        <button
          className="iconBtn iconBtn--danger"
          aria-label="Delete task"
          title="Delete"
          // TODO 3: Add onClick to delete this task from screen
          onClick={props.onDelete}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
