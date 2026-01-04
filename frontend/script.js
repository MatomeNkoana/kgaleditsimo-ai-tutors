// PRODUCTION URL (Uncomment this line when deploying)
// const API_BASE_URL = 'https://kgaleditsimo-ai-tutors.onrender.com';

// LOCAL URL
const API_BASE_URL = 'http://127.0.0.1:5000';

const container = document.getElementById('curriculum-container');
let allData = {}; // Variable to store the fetched data
let currentSubject = null; // NEW: Variable to track which main subject (Chem/CS) we are viewing

// 1. Fetch Data on Load
fetch(`${API_BASE_URL}/api/curriculum`)
    .then(response => response.json())
    .then(data => {
        allData = data; // Save data for later use
        renderMainMenu(); // Show the main list initially
    })
    .catch(error => console.error('Error:', error));

function renderMainMenu() {
    container.innerHTML = ''; 
    currentSubject = null;    

    // HIDE Chat when on main menu
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
        // Optional safe check for description
        desc.innerText = subject.description || `Explore ${subject.name} modules.`;
        card.appendChild(desc);

        // --- THE FIX IS HERE ---
        card.addEventListener('click', () => {
            currentSubject = subject; 
            renderModuleList(subject); // This routes to the breakdown, not the topics
        });
        // -----------------------

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

// 3. NEW Function: Draw the Module List (The 4 Sub-Cards)
function renderModuleList(subject) {
    container.innerHTML = ''; // Clear screen

    // Navigation: Back to Main Menu
    const backBtn = document.createElement('button');
    backBtn.innerText = "← Back to Subjects";
    backBtn.className = "back-button";
    backBtn.onclick = renderMainMenu;
    container.appendChild(backBtn);

    // Title
    const title = document.createElement('h2');
    title.innerText = subject.name; // e.g., "Chemistry"
    container.appendChild(title);

    // Grid for Modules
    const grid = document.createElement('div');
    grid.className = 'card-grid'; // Reuse existing grid CSS

    subject.modules.forEach(module => {
        const card = document.createElement('div');
        card.className = 'card'; // Use 'card' class for styling
        card.innerText = module.title;

        // Click Logic: Go to Topics
        card.addEventListener('click', () => {
            showTopics(module);
        });

        grid.appendChild(card);
    });

    container.appendChild(grid);
}

// 4. Function to Draw the Topics (Specific list inside a Module)
function showTopics(module) {
    if (!module.topics) {
        alert("No topics added for this module yet!");
        return;
    }

    container.innerHTML = ''; // Clear screen

    // Navigation: Back to Module List (not Main Menu)
    const backBtn = document.createElement('button');
    backBtn.innerText = `← Back to ${currentSubject.name}`;
    backBtn.className = "back-button";
    
    // We use the 'currentSubject' variable to know where to go back to
    backBtn.onclick = () => renderModuleList(currentSubject);
    
    container.appendChild(backBtn);

    const title = document.createElement('h2');
    title.innerText = module.title;
    container.appendChild(title);

    // Render Topics List
    const list = document.createElement('ul');
    
    module.topics.forEach(topic => {
        const item = document.createElement('li');
        item.className = 'module-item'; 
        item.innerHTML = `<strong>${topic.title}</strong>`;
        
        // Click to Enter Content View
        item.addEventListener('click', () => {
            showLessonContent(topic, module); // Pass module so we can go back
        });

        list.appendChild(item);
    });
    container.appendChild(list);
}

// 5. Function to Show the Specific Lesson Content
function showLessonContent(topic, module) {
    container.innerHTML = ''; // Clear screen

    // Navigation: Back to Topics
    const backBtn = document.createElement('button');
    backBtn.innerText = "← Back to Topics";
    backBtn.className = "back-button";
    // Go back to the topics of the specific module we passed in
    backBtn.onclick = () => showTopics(module); 
    container.appendChild(backBtn);

    // Content Display
    const title = document.createElement('h2');
    title.innerText = topic.title;
    container.appendChild(title);

    const contentBox = document.createElement('div');
    contentBox.className = 'module-item';
    contentBox.style.cursor = 'default';
    contentBox.style.transform = 'none';
    contentBox.innerHTML = topic.content;
    container.appendChild(contentBox);

    // Show Chat Interface below content
    document.getElementById('chat-interface').classList.remove('hidden');
    
    // Context-aware System Message
    const history = document.getElementById('chat-history');
    history.innerHTML = `<div class="message system-message">Studying <strong>${topic.title}</strong>. Ask me to explain any concept!</div>`;
}

// --- CHAT LOGIC (Unchanged) ---

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