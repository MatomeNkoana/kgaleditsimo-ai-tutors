// PRODUCTION URL (Uncomment this line when deploying)
// const API_BASE_URL = 'https://kgaleditsimo-ai-tutors.onrender.com';

// LOCAL URL
const API_BASE_URL = 'http://127.0.0.1:5000';

const container = document.getElementById('curriculum-container');
let allData = {}; 
let currentSubject = null; 

// ==========================================
// 0. HELPER FUNCTIONS
// ==========================================

// HELPER: Rescue the Chat Box before clearing the screen
function rescueChatInterface() {
    const chatContainer = document.getElementById('chat-interface');
    if (chatContainer && chatContainer.parentElement !== document.body) {
        document.body.appendChild(chatContainer);
        chatContainer.classList.add('hidden');
    }
}

// HELPER: Toggle Hero Section Visibility
// Shows Hero only on Main Menu, hides it for inner pages
function toggleHero(show) {
    const hero = document.querySelector('.hero-section');
    if (hero) {
        if (show) hero.style.display = 'flex';
        else hero.style.display = 'none';
    }
}

// ==========================================
// 1. GLOBAL EVENT LISTENERS (NAVBAR & HERO)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Logo Click -> Go Home
    const logoLink = document.getElementById('nav-logo');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault(); 
            renderMainMenu(true);
        });
    }

    // 2. Home Text Click -> Go Home
    const homeLink = document.getElementById('nav-home');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            renderMainMenu(true);
        });
    }

    // 3. Hero CTA Click -> Scroll to Grid
    const heroBtn = document.getElementById('hero-cta');
    if (heroBtn) {
        heroBtn.addEventListener('click', () => {
            const grid = document.querySelector('.main-subject-grid') || document.getElementById('curriculum-container');
            if (grid) {
                grid.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// ==========================================
// 2. BROWSER HISTORY & NAVIGATION LOGIC
// ==========================================

window.addEventListener('popstate', (event) => {
    const state = event.state;

    rescueChatInterface(); 

    if (!state || !allData.subjects) {
        renderMainMenu(false); 
        return;
    }

    if (state.subject) {
        currentSubject = state.subject;
    }

    try {
        if (state.view === 'main') renderMainMenu(false);
        else if (state.view === 'modules') renderModuleList(state.subject, false);
        else if (state.view === 'topics') showTopics(state.module, false);
        else if (state.view === 'sections') showSections(state.topic, state.module, false);
        else if (state.view === 'lesson') showLessonContent(state.section, state.topic, state.module, false);
    } catch (error) {
        console.warn("State Restore Failed:", error);
        rescueChatInterface();
        renderMainMenu(false);
    }
});

// ==========================================
// 3. INITIALIZATION
// ==========================================

fetch(`${API_BASE_URL}/api/curriculum`)
    .then(response => response.json())
    .then(data => {
        allData = data; 
        history.replaceState({ view: 'main' }, '', '#main'); 
        renderMainMenu(false); 
    })
    .catch(error => {
        console.error('Data Load Error:', error);
        container.innerHTML = '<p class="error">Failed to load curriculum. Please check backend connection.</p>';
    });


// ==========================================
// 4. CORE RENDERING FUNCTIONS
// ==========================================

function renderMainMenu(pushToHistory = true) {
    if (!allData.subjects) return; 

    if (pushToHistory) history.pushState({ view: 'main' }, '', '#main');

    rescueChatInterface(); 
    toggleHero(true); // SHOW HERO on Home Page

    container.innerHTML = ''; 
    currentSubject = null;    

    const chat = document.getElementById('chat-interface');
    if (chat) chat.classList.add('hidden');

    const header = document.createElement('h2');
    header.innerText = "Select a Subject";
    container.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'main-subject-grid'; 

    allData.subjects.forEach(subject => {
        const card = document.createElement('div');
        card.className = 'main-card';
        card.innerHTML = `<h3>${subject.name}</h3><p>${subject.description || 'Explore modules.'}</p>`;
        
        card.addEventListener('click', () => {
            currentSubject = subject; 
            renderModuleList(subject); 
        });
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function renderModuleList(subject, pushToHistory = true) {
    if (!subject) { renderMainMenu(false); return; }
    currentSubject = subject;
    
    if (pushToHistory) {
        history.pushState({ view: 'modules', subject: subject }, '', `#${subject.name.replace(/\s/g, '')}`);
    }

    rescueChatInterface(); 
    toggleHero(false); // HIDE HERO on inner pages

    container.innerHTML = '';
    
    const chat = document.getElementById('chat-interface');
    if (chat) chat.classList.add('hidden');
    
    const backBtn = document.createElement('button');
    backBtn.innerText = "← Back to Subjects";
    backBtn.className = "back-button";
    backBtn.onclick = () => renderMainMenu(true); 
    container.appendChild(backBtn);

    const title = document.createElement('h2');
    title.innerText = subject.name; 
    container.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'card-grid';

    if (subject.modules) {
        subject.modules.forEach(module => {
            const card = document.createElement('div');
            card.className = 'card';
            const descText = module.description || "Explore this module.";
            card.innerHTML = `<h3>${module.title}</h3><p>${descText}</p>`;
            card.addEventListener('click', () => showTopics(module));
            grid.appendChild(card);
        });
    }

    container.appendChild(grid);
}

function showTopics(module, pushToHistory = true) {
    if (!module || !module.topics) {
        if (currentSubject) renderModuleList(currentSubject, false);
        else renderMainMenu(false);
        return;
    }

    if (pushToHistory) {
        history.pushState({ view: 'topics', module: module, subject: currentSubject }, '', '#topics');
    }

    rescueChatInterface(); 
    toggleHero(false); // HIDE HERO

    container.innerHTML = ''; 
    
    const chat = document.getElementById('chat-interface');
    if (chat) chat.classList.add('hidden');
    
    const backBtn = document.createElement('button');
    const subjectName = currentSubject ? currentSubject.name : "Modules";
    backBtn.innerText = `← Back to ${subjectName}`;
    backBtn.className = "back-button";
    backBtn.onclick = () => {
        if (currentSubject) renderModuleList(currentSubject, true);
        else renderMainMenu(true);
    };
    container.appendChild(backBtn);

    const title = document.createElement('h2');
    title.innerText = module.title;
    container.appendChild(title);

    const listContainer = document.createElement('div');
    listContainer.className = 'vertical-list-container';

    module.topics.forEach(topic => {
        const card = document.createElement('div');
        card.className = 'card topic-card'; 
        const descText = topic.description || "No description available.";
        
        let outcomesHtml = '';
        if (topic.outcomes && topic.outcomes.length > 0) {
            outcomesHtml = `<div class="outcomes-box"><strong>Learning Outcomes:</strong><ul>` + 
                           topic.outcomes.map(o => `<li>${o}</li>`).join('') + 
                           `</ul></div>`;
        }

        card.innerHTML = `<div class="topic-header"><h3>${topic.title}</h3><p>${descText}</p></div>${outcomesHtml}`;
        card.addEventListener('click', () => showSections(topic, module));
        listContainer.appendChild(card);
    });
    container.appendChild(listContainer);
}

function showSections(topic, module, pushToHistory = true) {
    if (!topic || !module) { renderMainMenu(false); return; }

    if (!topic.sections) {
        if (topic.content) {
            showLessonContent({ title: topic.title, content: topic.content }, topic, module, pushToHistory);
            return;
        }
        alert("No content available.");
        return;
    }

    if (pushToHistory) {
        history.pushState({ view: 'sections', topic: topic, module: module, subject: currentSubject }, '', '#sections');
    }

    rescueChatInterface(); 
    toggleHero(false); // HIDE HERO

    container.innerHTML = '';
    
    const chat = document.getElementById('chat-interface');
    if (chat) chat.classList.add('hidden');

    const backBtn = document.createElement('button');
    backBtn.innerText = `← Back to ${module.title}`; 
    backBtn.className = "back-button";
    backBtn.onclick = () => showTopics(module, true);
    container.appendChild(backBtn);

    const title = document.createElement('h2');
    title.innerText = topic.title; 
    container.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'card-grid';

    topic.sections.forEach(section => {
        const card = document.createElement('div');
        card.className = 'card section-card'; 
        card.innerHTML = `<h3>${section.title}</h3>`;
        card.addEventListener('click', () => showLessonContent(section, topic, module));
        grid.appendChild(card);
    });
    container.appendChild(grid);
}

function showLessonContent(section, topic, module, pushToHistory = true) {
    if (!section || !topic) { 
        if (module) showTopics(module, false);
        else renderMainMenu(false);
        return;
    }

    if (pushToHistory) {
        history.pushState({ view: 'lesson', section: section, topic: topic, module: module, subject: currentSubject }, '', '#lesson');
    }

    rescueChatInterface(); 
    toggleHero(false); // HIDE HERO

    container.innerHTML = ''; 

    // Header & Navigation
    const navBar = document.createElement('div');
    navBar.style.marginBottom = '1rem';
    
    const backBtn = document.createElement('button');
    const goBack = () => {
        rescueChatInterface(); 
        if (topic.sections) showSections(topic, module, true); 
        else showTopics(module, true);
    };

    backBtn.innerText = `← Back to ${topic.sections ? topic.title : module.title}`;
    backBtn.className = "back-button";
    backBtn.onclick = goBack; 

    const title = document.createElement('span');
    title.style.marginLeft = '1rem';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1.2rem';
    title.innerText = section.title;

    navBar.appendChild(backBtn);
    navBar.appendChild(title);
    container.appendChild(navBar);

    // Dashboard
    const dashboard = document.createElement('div');
    dashboard.className = 'lesson-dashboard';

    const contentPanel = document.createElement('div');
    contentPanel.className = 'lesson-content-panel';
    contentPanel.innerHTML = section.content || "<p>No content available.</p>";
    dashboard.appendChild(contentPanel);

    const sidebar = document.createElement('div');
    sidebar.className = 'lesson-sidebar';

    // --- EMBED CHAT INTO SIDEBAR ---
    const chatContainer = document.getElementById('chat-interface');
    if (chatContainer) {
        chatContainer.classList.remove('hidden');
        chatContainer.classList.add('chat-box-embedded'); 
        
        const history = document.getElementById('chat-history');
        history.innerHTML = `<div class="message system-message">Studying <strong>${section.title}</strong>. Ask me to explain any concept!</div>`;
        
        sidebar.appendChild(chatContainer);
    }

    if (section.quiz && section.quiz.length > 0) {
        renderQuiz(section.quiz[0], sidebar);
    }

    dashboard.appendChild(sidebar);
    container.appendChild(dashboard);
}

// Helper: Render Quiz Widget
function renderQuiz(qData, parentContainer) {
    const quizBox = document.createElement('div');
    quizBox.className = 'quiz-box';
    
    quizBox.innerHTML = `<div class="quiz-header">⚡ Quick Check</div><p style="font-size:0.9rem">${qData.question}</p>`;
    
    const optionsDiv = document.createElement('div');
    qData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerText = opt;
        btn.onclick = () => {
            const feedback = quizBox.querySelector('.quiz-feedback');
            if (opt === qData.answer) {
                btn.style.background = '#d4edda'; btn.style.borderColor = '#c3e6cb';
                feedback.innerText = "Correct! ✅"; feedback.className = "quiz-feedback correct";
            } else {
                btn.style.background = '#f8d7da'; btn.style.borderColor = '#f5c6cb';
                feedback.innerText = "Try again. ❌"; feedback.className = "quiz-feedback incorrect";
            }
        };
        optionsDiv.appendChild(btn);
    });
    
    quizBox.appendChild(optionsDiv);
    const feedback = document.createElement('div');
    feedback.className = 'quiz-feedback';
    quizBox.appendChild(feedback);
    parentContainer.appendChild(quizBox);
}

// ==========================================
// 5. CHAT LOGIC
// ==========================================

const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatHistory = document.getElementById('chat-history');

function sendMessage() {
    const question = userInput.value;
    if (question.trim() === "") return;

    appendMessage('User', question, 'user-message');
    userInput.value = ''; 

    fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question })
    })
    .then(response => response.json())
    .then(data => appendMessage('AI Tutor', data.answer, 'ai-message'))
    .catch(error => {
        console.error('Chat Error:', error);
        appendMessage('System', 'Error connecting to the brain.', 'system-message');
    });
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

function appendMessage(sender, text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight; 
}