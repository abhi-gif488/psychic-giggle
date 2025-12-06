// components/todo.js
export function initTodo() {
    const list = document.getElementById('todo-list');
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-todo');
    const pomodoroBtn = document.getElementById('start-pomodoro');
    if (!list || !input || !addBtn || !pomodoroBtn) return;

    let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    function save() { localStorage.setItem('todos', JSON.stringify(todos)); }

    function render() {
        list.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.draggable = true;
            li.dataset.index = index;
            li.innerHTML = `<span>${escapeHtml(todo)}</span>
                <div>
                    <button class="btn-delete" data-index="${index}" aria-label="Delete task">Delete</button>
                </div>`;
            // drag events
            li.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
                li.classList.add('dragging');
            });
            li.addEventListener('dragend', () => li.classList.remove('dragging'));
            li.addEventListener('dragover', (e) => e.preventDefault());
            li.addEventListener('drop', (e) => {
                const draggedIndex = Number(e.dataTransfer.getData('text/plain'));
                const targetIndex = Number(li.dataset.index);
                if (!Number.isNaN(draggedIndex)) {
                    const item = todos.splice(draggedIndex, 1)[0];
                    todos.splice(targetIndex, 0, item);
                    save();
                    render();
                }
            });
            list.appendChild(li);
        });
    }

    // Add
    addBtn.addEventListener('click', () => {
        const value = input.value.trim();
        if (!value) return;
        todos.push(value);
        save();
        input.value = '';
        render();
    });

    // keyboard add
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addBtn.click();
    });

    // Delete (delegation)
    list.addEventListener('click', (e) => {
        if (e.target.matches('.btn-delete')) {
            const idx = Number(e.target.dataset.index);
            if (!Number.isNaN(idx)) {
                todos.splice(idx, 1);
                save();
                render();
            }
        }
    });

    // Pomodoro simple timer
    pomodoroBtn.addEventListener('click', () => {
        let time = 25 * 60;
        pomodoroBtn.disabled = true;
        const originalText = pomodoroBtn.textContent;
        const interval = setInterval(() => {
            const mm = Math.floor(time / 60).toString().padStart(2, '0');
            const ss = (time % 60).toString().padStart(2, '0');
            pomodoroBtn.textContent = `Pomodoro: ${mm}:${ss}`;
            time--;
            if (time < 0) {
                clearInterval(interval);
                alert('Pomodoro complete! Take a break.');
                pomodoroBtn.textContent = originalText;
                pomodoroBtn.disabled = false;
            }
        }, 1000);
    });

    render();
}

// safe escape for text nodes
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
}
