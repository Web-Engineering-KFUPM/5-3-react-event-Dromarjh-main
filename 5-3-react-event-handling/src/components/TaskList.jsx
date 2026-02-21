
import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks = [], onDelete }) {
  return (
    <ul className="list">
      {/* TODO (Task 2): if tasks.length === 0 show a placeholder message */}
      {tasks.length === 0 && (
        <p className="placeholder">No tasks yet. Add one above 👆</p>
      )}

      {/* TODO (Task 2 & 3): map tasks to TaskItem
          Example shape:
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} onDelete={onDelete} />
          ))
      */}
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          text={task.text}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}