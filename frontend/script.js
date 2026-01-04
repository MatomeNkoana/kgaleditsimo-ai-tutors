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
    // Fallback: If no sections exist (old data format), try showing content directly
    if (!topic.sections) {
        if (topic.content) {
            showLessonContent({ title: topic.title, content: topic.content }, topic, module);
            return;
        }
        alert("No sections content added for this topic yet!");
        return;
    }

    container.innerHTML = '';
    document.getElementById('chat-interface').classList.add('hidden'); // Hide chat here!

    const backBtn = document.createElement('button');
    backBtn.innerText = `← Back to ${module.title}`; 
    backBtn.className = "back-button";
    backBtn.onclick = () => showTopics(module);
    container.appendChild(backBtn);

    const title = document.createElement('h2');
    title.innerText = topic.title; 
    container.appendChild(title);

    const list = document.createElement('ul');
    
    topic.sections.forEach(section => {
        const item = document.createElement('li');
        item.className = 'module-item'; 
        item.innerHTML = `<strong>${section.title}</strong>`;
        
        // Click now goes to Final Content
        item.addEventListener('click', () => {
            showLessonContent(section, topic, module);
        });

        list.appendChild(item);
    });
    container.appendChild(list);
}

// 6. Lesson Content (The HTML Content + Chat)
function showLessonContent(section, topic, module) {
    container.innerHTML = ''; 

    // Navigation Logic: Handle whether we came from Sections or directly from Topics
    const backBtn = document.createElement('button');
    if (topic.sections) {
        backBtn.innerText = `← Back to ${topic.title}`;
        backBtn.onclick = () => showSections(topic, module); 
    } else {
        // Fallback for old data structure
        backBtn.innerText = `← Back to ${module.title}`;
        backBtn.onclick = () => showTopics(module);
    }
    backBtn.className = "back-button";
    container.appendChild(backBtn);

    const title = document.createElement('h2');
    title.innerText = section.title;
    container.appendChild(title);

    const contentBox = document.createElement('div');
    contentBox.className = 'module-item';
    contentBox.style.cursor = 'default';
    contentBox.style.transform = 'none';
    contentBox.innerHTML = section.content || "<p>No content available.</p>";
    container.appendChild(contentBox);

    // Show Chat Interface
    document.getElementById('chat-interface').classList.remove('hidden');
    
    const history = document.getElementById('chat-history');
    history.innerHTML = `<div class="message system-message">Studying <strong>${section.title}</strong>. Ask me to explain any concept!</div>`;
}

// --- CHAT LOGIC ---

const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatHistory = document.getElementById('chat-history');

sendBtn.addEventListener('click', () => {
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
});

function appendMessage(sender, text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight; 
}