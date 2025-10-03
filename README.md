# React Lab – Task Tracker (Event Handling)

⚠️ **Note:** Please follow the `instructions.txt` file to implement the TODOs.
This README file is only for the **overview of the lab** and the **concepts used**.

## Lab Overview
In this lab, you will practice **event handling in React** while building a simple **Task Tracker**.  
The Task Tracker allows you to type a task, display it on the screen, delete tasks individually, and clear all tasks at once.  

You have already learned about **components** and **props** in previous labs.  
This lab builds on those concepts by adding **event handling** so you can make your app interactive.  

---

## Read Assignment
Review the section on event handling in React:  
[5.8 Event Handling](https://learn.zybooks.com/zybook/SWE363Fall2025/chapter/5/section/8)

---

## What is Event Handling?

**Event handling** in React means writing code that responds to user actions such as typing in a text box, clicking a button, or submitting a form.  

### Why do we use Event Handling?
- To make web pages **interactive**.  
- To respond to user input (e.g., typing, clicking, selecting).  
- To trigger actions like **adding a task**, **deleting a task**, or **submitting a form**.  

### How to do Event Handling in React?
- React uses **camelCase** event names (e.g., `onClick`, `onChange`) instead of lowercase like in HTML.  
- You pass a **function** as the event handler, not a string.  
- Example syntax:  
  ```jsx
  <button onClick={handleClick}>Click Me</button>
  ```  

### Types of Event Handling in React
Common events include:  
- **onClick** → triggered when a button or element is clicked.  
- **onChange** → triggered when input value changes (typing in a text field).  
- **onSubmit** → triggered when submitting a form.  
- **onKeyDown / onKeyUp** → triggered when a key is pressed or released.  
- **onMouseEnter / onMouseLeave** → triggered when the mouse enters or leaves an element.  

---

## Concepts Used in This Lab
Besides **components** and **props** (already covered before), you will use the following:

### Event Handler Functions
Functions that respond to an event. In React, you usually define them inside your component.  

**Syntax:**
```jsx
function handleEvent() {
  // action performed when the event occurs
}
```

### onClick
Attaches an event handler to an element that executes when the element is clicked.  

**Syntax:**
```jsx
<button onClick={handlerFunction}>Click Me</button>
```

### onChange
Used mainly with inputs. Fires whenever the input value changes.  

**Syntax:**
```jsx
<input type="text" onChange={handlerFunction} />
```

### Passing Functions as Props
You can pass a handler function from a parent component to a child component, so the child can trigger actions in the parent.  

**Syntax:**
```jsx
<ChildComponent onAction={handlerFunction} />
```

---

## Understanding the map() Function in React

In this lab, you will see the `.map()` function used to render a list of tasks.  
This function is a very common way to display multiple items dynamically in React.

### What is map()?
- `.map()` is a JavaScript array method.  
- It loops over each element in an array and applies a function to it.  
- It returns a **new array** with the results of that function.  

### Syntax
```javascript
array.map((element, index) => {
  // return something for each element
});
```

### Parameters
- **element** → The current item in the array (for example, a task string like `"Make group"`).  
- **index** → The position of the item in the array (0 for the first item, 1 for the second, etc.).  

### Example in React
```jsx
{props.tasks.map((t, i) => (
  <TaskItem key={i} text={t} />
))}
```

### Explanation of Example
- `props.tasks` is an array that contains all the tasks.  
- `t` represents the current task (e.g., `"Prepare proposal"`).  
- `i` represents the index of that task in the array.  
- For each task in the array, we return a `<TaskItem />` component.  
- The `key={i}` is required by React to uniquely identify each list item and optimize rendering.  
- The task text (`t`) is passed as a prop into `<TaskItem />`.  

---

## Checklist Before Lab Submission
Make sure you have completed the following before submitting:

- [ ] The input field displays typed text on the screen.  
- [ ] Clicking **Submit** shows the task in the list below the input.  
- [ ] Each task has a **Delete** button that removes only that task from the list.  
- [ ] The **Clear All** button removes all tasks from the list and shows the placeholder message.  
- [ ] Code is properly indented and organized inside components (`TaskApp.jsx`, `TaskList.jsx`, `TaskItem.jsx`).  
- [ ] Only the required tasks from the semester project are used as input:  
  - Make group  
  - Prepare proposal  
  - Make prototype  
  - Implement front end  
  - Implement backend  
  - Deploy project  

---
