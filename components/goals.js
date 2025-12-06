export function initGoals() {
    const list = document.getElementById('goals-list');
    const input = document.getElementById('goal-input');
    const addBtn = document.getElementById('add-goal');
    if (!list || !input || !addBtn) return;

    let goals = JSON.parse(localStorage.getItem('goals') || '[]');

    function save() { localStorage.setItem('goals', JSON.stringify(goals)); }

    function render() {
        list.innerHTML = '';
        goals.forEach((goal, index) => {
            const container = document.createElement('div');
            container.className = 'goal-item';
            container.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <p style="margin:0 8px 0 0;font-weight:600">${escapeHtml(goal.name)}</p>
                    <div>
                        <button class="btn-inc" data-index="${index}" aria-label="Increase progress">+10%</button>
                        <button class="btn-del" data-index="${index}" aria-label="Delete goal">Delete</button>
                    </div>
                </div>
                <div class="progress-bar" aria-hidden="true">
                    <div class="progress-fill" style="width:${goal.progress}%"></div>
                </div>
            `;
            list.appendChild(container);
        });
    }

    addBtn.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) return;
        goals.push({ name: val, progress: 0 });
        save();
        input.value = '';
        render();
    });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addBtn.click(); });

    list.addEventListener('click', (e) => {
        const idx = Number(e.target.dataset.index);
        if (e.target.matches('.btn-inc') && !Number.isNaN(idx)) {
            goals[idx].progress = Math.min(100, goals[idx].progress + 10);
            save();
            if (goals[idx].progress === 100) alert(`Goal "${goals[idx].name}" achieved!`);
            render();
        } else if (e.target.matches('.btn-del') && !Number.isNaN(idx)) {
            goals.splice(idx, 1);
            save();
            render();
        }
    });

    render();
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;',
        "'":"&#39;"
    }[m]));
}
