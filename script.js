document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('task-input'); 
    const taskCategory = document.getElementById('task-category');
    const addTaskBtn = document.getElementById('add-task-btn'); 
    const taskList = document.getElementById('task-list'); 
    const filterButtons = document.querySelectorAll('.filter-btn'); 

    loadTasks();

    addTaskBtn.addEventListener('click', function () {
        const taskText = taskInput.value.trim(); 
        const category = taskCategory.value;
        if (taskText !== '') {
            addTask(taskText, category); 
            taskInput.value = ''; 
        }
    });

    function addTask(taskText, category) {
        const li = document.createElement('li'); 
        li.dataset.category = category; 
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox">
            <span>${taskText}</span>
            <div class="task-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        taskList.appendChild(li); 

        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', function () {
            toggleTaskCompletion(li, checkbox.checked);
            saveTasks();
        });

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function () {
            deleteTask(li);
            saveTasks();
        });

        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', function () {
            editTask(li);
            saveTasks();
        });

        saveTasks();
    }

    function toggleTaskCompletion(taskItem, isCompleted) {
        const taskText = taskItem.querySelector('span');
        if (isCompleted) {
            taskText.style.textDecoration = 'line-through';
            taskText.style.color = '#888';
        } else {
            taskText.style.textDecoration = 'none';
            taskText.style.color = '#000';
        }
    }

    function deleteTask(taskItem) {
        taskList.removeChild(taskItem); 
    }

    function editTask(taskItem) {
        const taskText = taskItem.querySelector('span');
        const newText = prompt('Edit your task:', taskText.textContent); 
        if (newText !== null && newText.trim() !== '') {
            taskText.textContent = newText.trim(); 
        }
    }

    function filterTasks(category) {
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(task => {
            if (category === 'all' || task.dataset.category === category) {
                task.style.display = 'flex'; 
            } else {
                task.style.display = 'none'; 
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.dataset.category;
            filterTasks(category); 
        });
    });

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(task => {
            tasks.push({
                text: task.querySelector('span').textContent,
                category: task.dataset.category,
                completed: task.querySelector('.task-checkbox').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.category = task.category;
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <div class="task-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            taskList.appendChild(li);

            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', function () {
                toggleTaskCompletion(li, checkbox.checked);
                saveTasks();
            });

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function () {
                deleteTask(li);
                saveTasks();
            });

            const editBtn = li.querySelector('.edit-btn');
            editBtn.addEventListener('click', function () {
                editTask(li);
                saveTasks();
            });

            if (task.completed) {
                toggleTaskCompletion(li, true);
            }
        });
    }
});