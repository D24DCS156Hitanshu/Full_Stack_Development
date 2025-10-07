import React, { useState } from "react";
import "./App.css";

function getProgress(tasks) {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

function getSubtaskProgress(subtasks) {
  if (!subtasks || subtasks.length === 0) return 0;
  const completed = subtasks.filter((st) => st.completed).length;
  return Math.round((completed / subtasks.length) * 100);
}

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

function formatTime12h(timeStr, ampm) {
  if (!timeStr) return "";
  let [h, m] = timeStr.split(":");
  let hour = parseInt(h, 10);
  if (ampm) {
    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
  }
  const ampmDisplay = (hour >= 12 ? "PM" : "AM");
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${m} ${ampmDisplay}`;
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [ampm, setAmpm] = useState("AM");
  const [deadline, setDeadline] = useState("");
  const [animateTaskId, setAnimateTaskId] = useState(null);
  const [completeAnimId, setCompleteAnimId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [editAmpm, setEditAmpm] = useState("AM");
  const [filter, setFilter] = useState("all");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [newSubtasks, setNewSubtasks] = useState([]);
  const [subtaskAnim, setSubtaskAnim] = useState({});

  // Add new task
  const addTask = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    let taskTime = time;
    if (taskTime) {
      let [h, m] = taskTime.split(":");
      h = parseInt(h, 10);
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      taskTime = `${h.toString().padStart(2, "0")}:${m}`;
    }
    const newTask = {
      text: input.trim(),
      completed: false,
      id: Date.now(),
      date,
      time: taskTime,
      ampm,
      deadline,
      created: Date.now(),
      subtasks: newSubtasks,
    };
    setTasks((prev) => [...prev, newTask]);
    setInput("");
    setDate("");
    setTime("");
    setAmpm("AM");
    setDeadline("");
    setNewSubtasks([]);
    setAnimateTaskId(newTask.id);
    setTimeout(() => setAnimateTaskId(null), 800);
  };

  // Toggle complete
  const toggleComplete = (id) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    setCompleteAnimId(id);
    setTimeout(() => setCompleteAnimId(null), 1200);
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Toggle subtask complete (view mode)
  const toggleTaskSubtask = (taskId, subtaskId) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
            }
          : task
      )
    );
    setSubtaskAnim((prev) => ({ ...prev, [subtaskId]: true }));
    setTimeout(() => setSubtaskAnim((prev) => ({ ...prev, [subtaskId]: false })), 800);
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditFields({
      text: task.text,
      date: task.date || "",
      time: task.time || "",
      deadline: task.deadline || "",
      subtasks: task.subtasks ? [...task.subtasks] : [],
      subtaskInput: "",
    });
    setEditAmpm(task.ampm || (task.time && parseInt(task.time.split(":")[0], 10) >= 12 ? "PM" : "AM"));
  };

  const saveEdit = (id) => {
    let editTime = editFields.time;
    if (editTime) {
      let [h, m] = editTime.split(":");
      h = parseInt(h, 10);
      if (editAmpm === "PM" && h < 12) h += 12;
      if (editAmpm === "AM" && h === 12) h = 0;
      editTime = `${h.toString().padStart(2, "0")}:${m}`;
    }
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...editFields,
              time: editTime,
              ampm: editAmpm,
              subtasks: editFields.subtasks || [],
            }
          : task
      )
    );
    setEditingId(null);
    setEditFields({});
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditFields({});
  };

  // Subtasks for new task
  const addNewSubtask = (e) => {
    e.preventDefault();
    if (!subtaskInput.trim()) return;
    setNewSubtasks((prev) => [
      ...prev,
      { text: subtaskInput.trim(), completed: false, id: Date.now() + Math.random() },
    ]);
    setSubtaskInput("");
  };
  const toggleNewSubtask = (id) => {
    setNewSubtasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
    setSubtaskAnim((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setSubtaskAnim((prev) => ({ ...prev, [id]: false })), 800);
  };
  const deleteNewSubtask = (id) => {
    setNewSubtasks((prev) => prev.filter((st) => st.id !== id));
  };

  // Subtasks for editing
  const addEditSubtask = (e) => {
    e.preventDefault();
    if (!editFields.subtaskInput?.trim()) return;
    setEditFields((fields) => ({
      ...fields,
      subtasks: [
        ...(fields.subtasks || []),
        { text: fields.subtaskInput.trim(), completed: false, id: Date.now() + Math.random() },
      ],
      subtaskInput: "",
    }));
  };
  const toggleEditSubtask = (sid) => {
    setEditFields((fields) => ({
      ...fields,
      subtasks: fields.subtasks.map((st) =>
        st.id === sid ? { ...st, completed: !st.completed } : st
      ),
    }));
    setSubtaskAnim((prev) => ({ ...prev, [sid]: true }));
    setTimeout(() => setSubtaskAnim((prev) => ({ ...prev, [sid]: false })), 800);
  };
  const deleteEditSubtask = (sid) => {
    setEditFields((fields) => ({
      ...fields,
      subtasks: fields.subtasks.filter((st) => st.id !== sid),
    }));
  };

  // Filtering
  let filteredTasks = tasks;
  if (filter === "active") filteredTasks = filteredTasks.filter((t) => !t.completed);
  if (filter === "completed") filteredTasks = filteredTasks.filter((t) => t.completed);

  // Progress
  const progress = getProgress(tasks);

  return (
    <div className="todo-app-container glass-bg">
      <h1 className="todo-title">To-Do List</h1>
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progress-bar-label">{progress}% completed</span>
      </div>
      {/* Filter Controls */}
      <div className="filter-sort-row">
        <div className="filter-group">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`filter-btn${filter === f.value ? " active" : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {/* Add Task Form */}
      <form className="todo-form" onSubmit={addTask}>
        <input
          className="todo-input"
          type="text"
          placeholder="Task description..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <input
          className="todo-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            className="todo-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ width: 110 }}
          />
          <select
            className="ampm-select"
            value={ampm}
            onChange={(e) => setAmpm(e.target.value)}
            style={{ height: 38, borderRadius: 8, border: '1.5px solid #6dd5ed', background: 'rgba(255,255,255,0.08)', color: '#f8fafc', fontSize: '1rem', outline: 'none', marginLeft: 2 }}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        <input
          className="todo-deadline"
          type="text"
          placeholder="Deadline (e.g. 2 days)"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button className="todo-add-btn" type="submit">
          +
        </button>
      </form>
      {/* Subtasks for new task */}
      <form className="subtask-form" onSubmit={addNewSubtask}>
        <input
          className="subtask-input"
          type="text"
          placeholder="Add subtask..."
          value={subtaskInput}
          onChange={(e) => setSubtaskInput(e.target.value)}
        />
        <button className="subtask-add-btn" type="submit">Add</button>
      </form>
      <ul className="subtask-list">
        {newSubtasks.map((st) => (
          <li key={st.id} className={`subtask-item${st.completed ? " completed" : ""} ${subtaskAnim[st.id] ? "subtask-animate" : ""}`}>
            <span className="subtask-checkbox" onClick={() => toggleNewSubtask(st.id)}>
              {st.completed ? "✔" : ""}
            </span>
            <span className="subtask-text">{st.text}</span>
            <button className="subtask-delete-btn" onClick={() => deleteNewSubtask(st.id)}>✕</button>
            {subtaskAnim[st.id] && <span className="confetti">🎉</span>}
          </li>
        ))}
      </ul>
      {/* Task List */}
      <ul className="todo-list">
        {filteredTasks.length === 0 && (
          <li className="todo-empty">No tasks found.</li>
        )}
        {filteredTasks.map((task) => {
          const subtaskProgress = getSubtaskProgress(task.subtasks);
          return (
            <li
              key={task.id}
              className={`todo-item glass-bg ${
                task.completed ? "completed" : ""
              } ${animateTaskId === task.id ? "task-animate-in" : ""} ${
                completeAnimId === task.id ? "task-complete-anim" : ""
              }`}
            >
              <span
                className="todo-checkbox"
                onClick={() => toggleComplete(task.id)}
                title="Mark as complete"
              >
                {task.completed ? "✔" : ""}
              </span>
              <div className="todo-main-content">
                {editingId === task.id ? (
                  <span className="todo-text-block">
                    <input
                      className="todo-input edit"
                      type="text"
                      value={editFields.text}
                      onChange={(e) => setEditFields({ ...editFields, text: e.target.value })}
                    />
                    <div className="edit-meta-row">
                      <input
                        className="todo-date edit"
                        type="date"
                        value={editFields.date}
                        onChange={(e) => setEditFields({ ...editFields, date: e.target.value })}
                      />
                      <div className="edit-time-group">
                        <input
                          className="todo-time edit"
                          type="time"
                          value={editFields.time}
                          onChange={(e) => setEditFields({ ...editFields, time: e.target.value })}
                        />
                        <select
                          className="ampm-select"
                          value={editAmpm}
                          onChange={(e) => setEditAmpm(e.target.value)}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                        {editFields.time && (
                          <span className="todo-time-show" style={{marginLeft: 8}}>
                            {formatTime12h(editFields.time, editAmpm)}
                          </span>
                        )}
                      </div>
                      <input
                        className="todo-deadline edit"
                        type="text"
                        placeholder="Deadline"
                        value={editFields.deadline}
                        onChange={(e) => setEditFields({ ...editFields, deadline: e.target.value })}
                      />
                    </div>
                    {/* Subtasks editing */}
                    <form className="subtask-form" onSubmit={addEditSubtask}>
                      <input
                        className="subtask-input"
                        type="text"
                        placeholder="Add subtask..."
                        value={editFields.subtaskInput || ""}
                        onChange={(e) => setEditFields({ ...editFields, subtaskInput: e.target.value })}
                      />
                      <button className="subtask-add-btn" type="submit">Add</button>
                    </form>
                    <ul className="subtask-list">
                      {editFields.subtasks && editFields.subtasks.map((st) => (
                        <li key={st.id} className={`subtask-item${st.completed ? " completed" : ""} ${subtaskAnim[st.id] ? "subtask-animate" : ""}`}>
                          <span className="subtask-checkbox" onClick={() => toggleEditSubtask(st.id)}>
                            {st.completed ? "✔" : ""}
                          </span>
                          <span className="subtask-text">{st.text}</span>
                          <button className="subtask-delete-btn" onClick={() => deleteEditSubtask(st.id)}>✕</button>
                          {subtaskAnim[st.id] && <span className="confetti">🎉</span>}
                        </li>
                      ))}
                    </ul>
                    <div className="edit-btn-row">
                      <button className="edit-save-btn" onClick={() => saveEdit(task.id)}>
                        Save
                      </button>
                      <button className="edit-cancel-btn" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </span>
                ) : (
                  <span className="todo-text-block">
                    <span className="todo-text">{task.text}</span>
                    <span className="todo-meta">
                      {task.date && <span className="todo-date-show">📅 {task.date}</span>}
                      {task.time && <span className="todo-time-show">⏰ {formatTime12h(task.time, task.ampm)}</span>}
                      {task.deadline && (
                        <span className="todo-deadline-show">⏳ {task.deadline}</span>
                      )}
                    </span>
                    <ul className="subtask-list">
                      {task.subtasks && task.subtasks.length > 0 && task.subtasks.map((st) => (
                        <li key={st.id} className={`subtask-item${st.completed ? " completed" : ""} ${subtaskAnim[st.id] ? "subtask-animate" : ""}`}>
                          <span className="subtask-checkbox" onClick={() => toggleTaskSubtask(task.id, st.id)}>{st.completed ? "✔" : ""}</span>
                          <span className="subtask-text">{st.text}</span>
                          {subtaskAnim[st.id] && <span className="confetti">🎉</span>}
                        </li>
                      ))}
                    </ul>
                  </span>
                )}
                {/* Per-task progress bar */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="progress-bar-container task-progress-bar">
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${subtaskProgress}%` }}></div>
                    </div>
                    <span className="progress-bar-label">{subtaskProgress}%</span>
                  </div>
                )}
              </div>
              <div className="todo-actions">
                {editingId !== task.id && (
                  <button
                    className="todo-edit-btn"
                    onClick={() => startEdit(task)}
                    title="Edit task"
                  >
                    ✎
                  </button>
                )}
                <button
                  className="todo-delete-btn"
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  ✕
                </button>
              </div>
              {completeAnimId === task.id && (
                <span className="confetti">🎉</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
