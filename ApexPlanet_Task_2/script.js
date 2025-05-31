                                                         
let todos = [];
let currentFilter = 'all';
let todoIdCounter = 1;

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupFormValidation();
    setupTodoApp();
    loadTodosFromStorage();
    updateTodoStats();
}

function showSection(sectionId) {
   
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    event.target.classList.add('active');
}


function setupEventListeners() {
   
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
   
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    }
}

function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const validators = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid name (letters and spaces only, minimum 2 characters)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: false,
            pattern: /^[\+]?[\d\s\-\(\)]+$/,
            minLength: 10,
            message: 'Please enter a valid phone number (minimum 10 digits)'
        },
        subject: {
            required: true,
            message: 'Please select a subject'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 500,
            message: 'Please enter a message (10-500 characters)'
        }
    };
    
    window.formValidators = validators;
}

function validateField(event) {
    const field = event.target;
    const fieldName = field.name;
    const value = field.value.trim();
    const validator = window.formValidators[fieldName];
    
    if (!validator) return true;
    
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
   
    formGroup.classList.remove('error');
    
    if (validator.required && !value) {
        showFieldError(formGroup, errorMessage, validator.message);
        return false;
    }
    if (!value && !validator.required) {
        return true;
    }
    
   
    if (validator.pattern && !validator.pattern.test(value)) {
        showFieldError(formGroup, errorMessage, validator.message);
        return false;
    }
    
  
    if (validator.minLength && value.length < validator.minLength) {
        showFieldError(formGroup, errorMessage, validator.message);
        return false;
    }
    
    if (validator.maxLength && value.length > validator.maxLength) {
        showFieldError(formGroup, errorMessage, validator.message);
        return false;
    }
    
    return true;
}


function showFieldError(formGroup, errorMessage, message) {
    formGroup.classList.add('error');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
}

function clearFieldError(event) {
    const field = event.target;
    const formGroup = field.closest('.form-group');
    if (formGroup.classList.contains('error')) {
        formGroup.classList.remove('error');
    }
}


function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    let isValid = true;
    
    
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    fields.forEach(field => {
        const fieldValid = validateField({ target: field });
        if (!fieldValid) {
            isValid = false;
        }
    });
    
    if (isValid) {
        
        const successMessage = document.getElementById('formSuccess');
        if (successMessage) {
            successMessage.style.display = 'block';
            
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
        
        
        form.reset();
        
       
        console.log('Form submitted successfully!');
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        console.log('Form Data:', data);
        
        alert('Thank you! Your message has been sent successfully.');
    } else {
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }
}


function setupTodoApp() {
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoInput = document.getElementById('todoInput');
    const clearCompleted = document.getElementById('clearCompleted');
    const clearAll = document.getElementById('clearAll');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', addTodo);
    }
    
    if (todoInput) {
        todoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });
    }
    
    if (clearCompleted) {
        clearCompleted.addEventListener('click', clearCompletedTodos);
    }
    
    if (clearAll) {
        clearAll.addEventListener('click', clearAllTodos);
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            setFilter(this.dataset.filter);
        });
    });
}

function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const todoPriority = document.getElementById('todoPriority');
    
    if (!todoInput || !todoPriority) return;
    
    const text = todoInput.value.trim();
    const priority = todoPriority.value;
    
    if (text === '') {
        alert('Please enter a task!');
        todoInput.focus();
        return;
    }
    
    if (text.length > 100) {
        alert('Task is too long! Maximum 100 characters allowed.');
        return;
    }
    
    const todo = {
        id: todoIdCounter++,
        text: text,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.unshift(todo);
    todoInput.value = '';
    todoPriority.value = 'low';
    
    saveTodosToStorage();
    renderTodos();
    updateTodoStats();
    
    todoInput.style.border = '2px solid #38a169';
    setTimeout(() => {
        todoInput.style.border = '';
    }, 1000);
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodosToStorage();
        renderTodos();
        updateTodoStats();
    }
}

function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodosToStorage();
        renderTodos();
        updateTodoStats();
    }
}


function setFilter(filter) {
    currentFilter = filter;
    
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    renderTodos();
}
function getFilteredTodos() {
    switch (currentFilter) {
        case 'completed':
            return todos.filter(todo => todo.completed);
        case 'pending':
            return todos.filter(todo => !todo.completed);
        case 'high':
            return todos.filter(todo => todo.priority === 'high');
        default:
            return todos;
    }
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    if (!todoList) return;
    
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <li class="no-todos">
                <p>No tasks found!</p>
                <p style="font-size: 14px; opacity: 0.7;">
                    ${currentFilter === 'all' ? 'Add a new task to get started.' : `No ${currentFilter} tasks available.`}
                </p>
            </li>
        `;
        return;
    }
    
    todoList.innerHTML = filteredTodos.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''} ${todo.priority}-priority" data-id="${todo.id}">
            <div class="todo-content">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                       onchange="toggleTodo(${todo.id})">
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <span class="todo-priority ${todo.priority}">${todo.priority}</span>
            </div>
            <div class="todo-actions-item">
                <button class="delete-btn" onclick="deleteTodo(${todo.id})" title="Delete task">
                    ✕
                </button>
            </div>
        </li>
    `).join('');
}

function updateTodoStats() {
    const totalTasks = document.getElementById('totalTasks');
    const pendingTasks = document.getElementById('pendingTasks');
    const completedTasks = document.getElementById('completedTasks');
    
    if (totalTasks) totalTasks.textContent = todos.length;
    if (pendingTasks) pendingTasks.textContent = todos.filter(t => !t.completed).length;
    if (completedTasks) completedTasks.textContent = todos.filter(t => t.completed).length;
}

function clearCompletedTodos() {
    const completedCount = todos.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        alert('No completed tasks to clear!');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
        todos = todos.filter(t => !t.completed);
        saveTodosToStorage();
        renderTodos();
        updateTodoStats();
    }
}

function clearAllTodos() {
    if (todos.length === 0) {
        alert('No tasks to clear!');
        return;
    }
    
    if (confirm(`Are you sure you want to delete all ${todos.length} task(s)? This action cannot be undone.`)) {
        todos = [];
        todoIdCounter = 1;
        saveTodosToStorage();
        renderTodos();
        updateTodoStats();
    }
}

function saveTodosToStorage() {
    try {
        console.log('Todos saved:', todos);
    } catch (error) {
        console.error('Error saving todos:', error);
    }
}

function loadTodosFromStorage() {
    try {
        
        if (todos.length === 0) {
            todos = [
                {
                    id: todoIdCounter++,
                    text: 'Complete the contact form validation',
                    priority: 'high',
                    completed: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: todoIdCounter++,
                    text: 'Build responsive layout with CSS Grid',
                    priority: 'medium',
                    completed: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: todoIdCounter++,
                    text: 'Add dynamic functionality to todo list',
                    priority: 'high',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: todoIdCounter++,
                    text: 'Test responsive design on mobile devices',
                    priority: 'low',
                    completed: false,
                    createdAt: new Date().toISOString()
                }
            ];
        }
        
        renderTodos();
    } catch (error) {
        console.error('Error loading todos:', error);
        todos = [];
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


window.addEventListener('resize', function() {
   
    if (window.innerWidth > 768) {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.style.display = '';
        }
    }
});


document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.getElementById(e.target.getAttribute('href').slice(1));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
});


function showLoading(element) {
    if (element) {
        element.style.opacity = '0.6';
        element.style.pointerEvents = 'none';
    }
}

function hideLoading(element) {
    if (element) {
        element.style.opacity = '';
        element.style.pointerEvents = '';
    }
}


document.addEventListener('keydown', function(e) {
   
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        }
    }
    
    if (e.ctrlKey && e.key === 'Enter') {
        const activeForm = document.querySelector('form:focus-within');
        if (activeForm) {
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}


console.log(`
🎉 Task 2: Intermediate Web Development - Complete!

✅ Contact Form with Validation
✅ Responsive Layout (Flexbox + CSS Grid)
✅ Dynamic To-Do List with DOM Manipulation
✅ Mobile-First Responsive Design
✅ Form Validation with Real-time Feedback
✅ Local Storage Integration (Demo Mode)

📱 Test the responsive design by resizing your browser!
🎨 Switch between sections using the navigation buttons.
📝 Try submitting the contact form with different inputs.
✏️  Add, complete, and filter tasks in the to-do list.

Happy coding! 🚀
`);


if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        addTodo,
        toggleTodo,
        deleteTodo,
        setFilter,
        escapeHtml
    };
}