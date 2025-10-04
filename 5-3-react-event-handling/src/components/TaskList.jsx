import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList(props) {
  return (
    <ul className="list">
      {/* TODO 2: Render TaskItem using props (map over tasks if multiple)
          Example once props are wired:
          {props.tasks?.map((t, i) => (
            <TaskItem key={i} text={t} />
          ))}
      */}

      {/* Placeholder so UI doesn’t look empty */}
      <li className="list__placeholder">
        Your tasks will appear here after Submit.
      </li>
    </ul>
  );
}
