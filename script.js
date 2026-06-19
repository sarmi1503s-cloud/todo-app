let currentFilter = 'all';

function addTask() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();

  if (taskText === '') {
    alert('Please enter a task! 🌟');
    return;
  }

  const now = new Date();
  const dateStr = now.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
  const dateKey = now.toDateString();
  createTaskElement(taskText, false, dateStr,dateKey);
  saveTasks();
  input.value = '';
  updateCounter();
   checkCelebration();
}

function createTaskElement(text, isDone, date,dateKey) {
  const li = document.createElement('li');
  if (isDone) li.classList.add('done');
  li.dataset.dateKey = dateKey;
  // task info div
  const taskInfo = document.createElement('div');
  taskInfo.classList.add('task-info');

  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add('task-text');

  const dateSpan = document.createElement('span');
  dateSpan.textContent = '🕐 ' + date;
  dateSpan.classList.add('task-date');

  taskInfo.appendChild(span);
  taskInfo.appendChild(dateSpan);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✕';
  deleteBtn.classList.add('delete-btn');

  li.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) return;
    li.classList.toggle('done');
    saveTasks();
    updateCounter();
    filterTasks(currentFilter);
      checkCelebration();
  });

  deleteBtn.addEventListener('click', function() {
    li.remove();
    saveTasks();
    updateCounter();
      checkCelebration();
  });

  li.appendChild(taskInfo);
  li.appendChild(deleteBtn);
  document.getElementById('taskList').appendChild(li);

  filterTasks(currentFilter);
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach(li => {
    tasks.push({
      text: li.querySelector('.task-text').textContent,
      date: li.querySelector('.task-date').textContent.replace('🕐 ', ''),
      dateKey: li.dataset.dateKey,
      done: li.classList.contains('done')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem('tasks')) || [];
  const today = new Date().toDateString();
  let carriedForward = false;
  // separate today's tasks from old tasks
  const updatedTasks = [];

  saved.forEach(task => {
    if (task.dateKey === today) {
      // today's tasks — keep as is
      updatedTasks.push(task);
    } else {
      // yesterday's tasks
      if (!task.done) {
        carriedForward = true;
        // incomplete — carry forward to today with new date
        const now = new Date();
        const newDateStr = now.toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
        updatedTasks.push({
          text: task.text,
          done: false,
          date: newDateStr,
          dateKey: today
        });
      }
      // completed old tasks — skip them (auto deleted) ✅
    }
  });

  // save the cleaned up tasks
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  // now load them
  updatedTasks.forEach(task => createTaskElement(task.text, task.done, task.date, task.dateKey));
  updateCounter();
  checkCelebration();
  const reminder = document.getElementById('reminder');
  if (carriedForward) {
    reminder.style.display = 'block';
  } else {
    reminder.style.display = 'none';
  }
}

function updateCounter() {
  const total = document.querySelectorAll('#taskList li').length;
  const done = document.querySelectorAll('#taskList li.done').length;
  document.getElementById('counter').textContent = `${done}/${total} tasks done 🎯`;
}

function filterTasks(filter) {
  currentFilter = filter;

  // update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase() === filter) {
      btn.classList.add('active');
    }
  });

  // show/hide tasks
  document.querySelectorAll('#taskList li').forEach(li => {
    if (filter === 'all') {
      li.style.display = 'flex';
    } else if (filter === 'active') {
      li.style.display = li.classList.contains('done') ? 'none' : 'flex';
    } else if (filter === 'completed') {
      li.style.display = li.classList.contains('done') ? 'flex' : 'none';
    }
  });
}

document.getElementById('taskInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') addTask();
});

window.onload = function() {
  loadTasks();
}
function checkCelebration() {
  const total = document.querySelectorAll('#taskList li').length;
  const done = document.querySelectorAll('#taskList li.done').length;
  const celebration = document.getElementById('celebration');

  if (total > 0 && done === total) {
    celebration.style.display = 'block';
  } else {
    celebration.style.display = 'none';
  }
}
function closeReminder() {
  document.getElementById('reminder').style.display = 'none';
}