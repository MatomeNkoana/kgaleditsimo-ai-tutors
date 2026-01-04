// PRODUCTION URL (Uncomment this line when deploying)
// const API_BASE_URL = 'https://kgaleditsimo-ai-tutors.onrender.com';

// LOCAL URL
const API_BASE_URL = 'http://127.0.0.1:5000';

const container = document.getElementById('curriculum-container');
let allData = {}; 
let currentSubject = null; 

// 1. Fetch Data on Load
fetch(`${API_BASE_URL}/api/curriculum`)
    .then(response => response.json())
    .then(data => {
        allData = data; 
        renderMainMenu(); 
    })
    .catch(error => console.error('Error:', error));

// 2. Main Menu (Subject Selection)
function renderMainMenu() {
    container.innerHTML = ''; 
    currentSubject = null;    

    document.getElementById('chat-interface').classList.add('hidden');

    const header = document.createElement('h2');
    header.innerText = "Select a Subject";
    container.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'main-subject-grid'; 

    allData.subjects.forEach(subject => {
        const card = document.createElement('div');
        card.className = 'main-card';
        
        const title = document.createElement('h3');
        title.innerText = subject.name;
        card.appendChild(title);

        const desc = document.createElement('p');
        desc.innerText = subject.description || `Explore ${subject.name} modules.`;
        card.appendChild(desc);

        card.addEventListener('click', () => {
            currentSubject = subject; 
            renderModuleList(subject); 
        });

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

// 3. Module List (e.g., Organic, Inorganic)
function renderModuleList(subject) {
    currentSubject = subject;
    container.innerHTML = '';
    document.getElementById('chat-interface').classList.add('hidden');
    const backBtn = document.createElement('button');
    backBtn.innerText = "← Back to Subjects";
    backBtn.className = "back-button";
    backBtn.onclick = renderMainMenu;
    container.appendChild(backBtn);

    const title = document.createElement('h2');
    title.innerText = subject.name; 
    container.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'card-grid';

    subject.modules.forEach(module => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // --- NEW CODE: Render Title + Description ---
        const descText = module.description || "Explore this module.";
        card.innerHTML = `
            <h3>${module.title}</h3>
            <p>${descText}</p>
        `;
        // ---------------------------------------------

        card.addEventListener('click', () => {
            showTopics(module);
        });

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

// 4. Topics List (e.g., Gravimetry, Titration)
function showTopics(module) {
    if (!module.topics) {
        alert("No topics added for this module yet!");
        return;
    }

    container.innerHTML = ''; 
    document.getElementById('chat-interface').classList.add('hidden');
    
    // Navigation
    const backBtn = document.createElement('button');
    backBtn.innerText = `← Back to ${currentSubject.name}`;
    backBtn.className = "back-button";
    backBtn.onclick = () => renderModuleList(currentSubject);
    container.appendChild(backBtn);

    const title = document.createElement('h2');
    title.innerText = module.title;
    container.appendChild(title);

    // CHANGE: Use a specific container for the vertical list layout
    const listContainer = document.createElement('div');
    listContainer.className = 'vertical-list-container';

    module.topics.forEach(topic => {
        const card = document.createElement('div');
        // We reuse the 'card' class for shadow/border, but add 'topic-card' for specific layout
        card.className = 'card topic-card'; 
        
        // 1. Prepare Outcomes HTML (if they exist)
        let outcomesHtml = '';
        if (topic.outcomes && topic.outcomes.length > 0) {
            outcomesHtml = `<div class="outcomes-box">
                                <strong>Learning Outcomes:</strong>
                                <ul>`;
            topic.outcomes.forEach(outcome => {
                outcomesHtml += `<li>${outcome}</li>`;
            });
            outcomesHtml += `   </ul>
                             </div>`;
        }

        // 2. Prepare Description
        const descText = topic.description || "No description available.";

        // 3. Render the Card Content
        card.innerHTML = `
            <div class="topic-header">
                <h3>${topic.title}</h3>
                <p>${descText}</p>
            </div>
            ${outcomesHtml}
        `;
        
        // 4. Click Logic (Go to Sections)
        card.addEventListener('click', () => {
            showSections(topic, module);
        });

        listContainer.appendChild(card);
    });
    container.appendChild(listContainer);
}

// 5. Sections List (e.g., Precipitation, Volatilization)
function showSections(topic, module) {
    // Fallback logic remains the same
    if (!topic.sections) {
        if (topic.content) {
            showLessonContent({ title: topic.title, content: topic.content }, topic, module);
            return;
        }
        alert("No sections content added for this topic yet!");
        return;
    }

    container.innerHTML = '';
    document.getElementById('chat-interface').classList.add('hidden'); 

    // Navigation
    const backBtn = document.createElement('button');
    backBtn.innerText = `← Back to ${module.title}`; 
    backBtn.className = "back-button";
    backBtn.onclick = () => showTopics(module);
    container.appendChild(backBtn);

    // Page Title
    const title = document.createElement('h2');
    title.innerText = topic.title; 
    container.appendChild(title);

    // CHANGE: Use 'card-grid' instead of a list
    const grid = document.createElement('div');
    grid.className = 'card-grid';

    topic.sections.forEach(section => {
        const card = document.createElement('div');
        // We use 'card' for the shape, and 'section-card' for specific tweaks
        card.className = 'card section-card'; 
        
        // Render Title
        card.innerHTML = `<h3>${section.title}</h3>`;
        
        // Click Logic
        card.addEventListener('click', () => {
            showLessonContent(section, topic, module);
        });

        grid.appendChild(card);
    });
    container.appendChild(grid);
}

// 6. Lesson Content (The HTML Content + Chat)
function showLessonContent(section, topic, module) {
    container.innerHTML = ''; 

    // 1. Navigation Header
    const navBar = document.createElement('div');
    navBar.style.marginBottom = '1rem';
    
    const backBtn = document.createElement('button');
    
    // --- THE FIX: RESCUE THE CHAT BOX BEFORE NAVIGATING ---
    const goBack = () => {
        // 1. Find the chat box
        const chatContainer = document.getElementById('chat-interface');
        // 2. Move it safely back to the document body (outside the container we are about to clear)
        if (chatContainer) {
            document.body.appendChild(chatContainer);
            chatContainer.classList.add('hidden');
        }
        // 3. Now it is safe to navigate
        if (topic.sections) {
            showSections(topic, module); 
        } else {
            showTopics(module);
        }
    };
    // -----------------------------------------------------

    if (topic.sections) {
        backBtn.innerText = `← Back to ${topic.title}`;
    } else {
        backBtn.innerText = `← Back to ${module.title}`;
    }
    backBtn.className = "back-button";
    backBtn.onclick = goBack; // Attach the smart back function

    const title = document.createElement('span');
    title.style.marginLeft = '1rem';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1.2rem';
    title.innerText = section.title;

    navBar.appendChild(backBtn);
    navBar.appendChild(title);
    container.appendChild(navBar);

    // 2. Dashboard Layout Container
    const dashboard = document.createElement('div');
    dashboard.className = 'lesson-dashboard';

    // --- LEFT PANEL: Content ---
    const contentPanel = document.createElement('div');
    contentPanel.className = 'lesson-content-panel';
    contentPanel.innerHTML = section.content || "<p>No content available.</p>";
    dashboard.appendChild(contentPanel);

    // --- RIGHT PANEL: Sidebar (Chat + Quiz) ---
    const sidebar = document.createElement('div');
    sidebar.className = 'lesson-sidebar';

    // A. Chat Interface (Moved inside)
    const chatContainer = document.getElementById('chat-interface');
    if (chatContainer) {
        chatContainer.classList.remove('hidden');
        chatContainer.classList.add('chat-box-embedded'); 
        
        const history = document.getElementById('chat-history');
        history.innerHTML = `<div class="message system-message">Studying <strong>${section.title}</strong>. Ask me to explain any concept!</div>`;

        sidebar.appendChild(chatContainer);
    }

    // B. Quiz Widget
    if (section.quiz && section.quiz.length > 0) {
        const quizBox = document.createElement('div');
        quizBox.className = 'quiz-box';
        
        const quizTitle = document.createElement('div');
        quizTitle.className = 'quiz-header';
        quizTitle.innerHTML = '⚡ Quick Check';
        quizBox.appendChild(quizTitle);

        const qData = section.quiz[0];
        const qText = document.createElement('p');
        qText.innerText = qData.question;
        qText.style.fontSize = '0.9rem';
        quizBox.appendChild(qText);

        const optionsDiv = document.createElement('div');
        qData.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.innerText = opt;
            btn.onclick = () => {
                const feedback = quizBox.querySelector('.quiz-feedback');
                if (opt === qData.answer) {
                    btn.style.background = '#d4edda';
                    btn.style.borderColor = '#c3e6cb';
                    feedback.innerText = "Correct! ✅";
                    feedback.className = "quiz-feedback correct";
                } else {
                    btn.style.background = '#f8d7da';
                    btn.style.borderColor = '#f5c6cb';
                    feedback.innerText = "Try again. ❌";
                    feedback.className = "quiz-feedback incorrect";
                }
            };
            optionsDiv.appendChild(btn);
        });
        quizBox.appendChild(optionsDiv);

        const feedback = document.createElement('div');
        feedback.className = 'quiz-feedback';
        quizBox.appendChild(feedback);

        sidebar.appendChild(quizBox);
    }

    dashboard.appendChild(sidebar);
    container.appendChild(dashboard);
}

// --- CHAT LOGIC ---

const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatHistory = document.getElementById('chat-history');

// Define sendMessage logic as a standalone function so we can reuse it
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
    .then(data => {
        appendMessage('AI Tutor', data.answer, 'ai-message');
    })
    .catch(error => {
        console.error('Error:', error);
        appendMessage('System', 'Error connecting to the brain.', 'system-message');
    });
}

// 1. Click Listener
sendBtn.addEventListener('click', sendMessage);

// 2. Enter Key Listener (NEW FEATURE)
userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function appendMessage(sender, text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight; 
}