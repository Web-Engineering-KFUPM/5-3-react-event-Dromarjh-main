import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList(props) {
  return (
    <ul className="list" id="taskList">
      {/* TODO 2: Render TaskItem using props (map over tasks if multiple)
          This will be used when students learn state.
          Example (future):
          {props.tasks?.map((t, i) => (
            <TaskItem key={i} text={t} />
          ))}
      */}

      {/* Placeholder so UI doesn’t look empty */}
      <li id="listPlaceholder" className="list__placeholder">
        Your tasks will appear here after Submit.
      </li>
    </ul>
  );
}
