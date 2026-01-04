// PRODUCTION URL (Uncomment this line when deploying)
// const API_BASE_URL = 'https://kgaleditsimo-ai-tutors.onrender.com';

// LOCAL URL
const API_BASE_URL = 'http://127.0.0.1:5000';


const container = document.getElementById('curriculum-container');
let allData = {}; // Variable to store the fetched data

// 1. Fetch Data on Load
fetch(`${API_BASE_URL}/api/curriculum`)
    .then(response => response.json())
    .then(data => {
        allData = data; // Save data for later use
        renderMainMenu(); // Show the main list initially
    })
    .catch(error => console.error('Error:', error));

// 2. Function to Draw the Main Menu
function renderMainMenu() {
    container.innerHTML = ''; // Clear the screen

    // HIDE Chat when on main menu
    document.getElementById('chat-interface').classList.add('hidden')

    allData.subjects.forEach(subject => {
        const title = document.createElement('h3');
        title.innerText = subject.name;
        container.appendChild(title);

        const list = document.createElement('ul');
        
        subject.modules.forEach(module => {
            const item = document.createElement('li');
            item.innerText = module.title;
            item.className = 'module-item'; // Add CSS class
            
            // Add Click Listener
            item.addEventListener('click', () => {
                showTopics(module);
            });

            list.appendChild(item);
        });
        container.appendChild(list);
    });
}

// 3. Function to Draw the Topics (The Drill-Down)
function showTopics(module) {
    if (!module.topics) {
        alert("No topics added for this module yet!");
        return;
    }

    container.innerHTML = ''; // Clear screen

    // 1. Header & Navigation
    const backBtn = document.createElement('button');
    backBtn.innerText = "← Back to Subjects";
    backBtn.onclick = renderMainMenu;
    container.appendChild(backBtn);

    const title = document.createElement('h2');
    title.innerText = module.title;
    container.appendChild(title);

    // 2. Render Topics as CARDS (Grid Layout)
    const list = document.createElement('ul'); // Re-use grid layout from CSS
    
    module.topics.forEach(topic => {
        const item = document.createElement('li');
        item.className = 'module-item'; // Apply the same card style
        item.innerHTML = `<strong>${topic.title}</strong>`; // Just show title first
        
        // Click to Enter Content View
        item.addEventListener('click', () => {
            showLessonContent(topic);
        });

        list.appendChild(item);
    });
    container.appendChild(list);
}

// 3. New Function: Show the Specific Lesson Content
function showLessonContent(topic) {
    container.innerHTML = ''; // Clear screen

    // Navigation
    const backBtn = document.createElement('button');
    backBtn.innerText = "← Back to Topics";
    // We need to reload the module view here. 
    // In a real app, we'd pass the 'module' object again. 
    // For now, simple reload or re-fetch might be needed, 
    // but simply: location.reload() is the lazy way. 
    // Better: We just re-render main menu for now or store 'currentModule' globally.
    backBtn.onclick = renderMainMenu; 
    container.appendChild(backBtn);

    // Content Display
    const title = document.createElement('h2');
    title.innerText = topic.title;
    container.appendChild(title);

    const contentBox = document.createElement('div');
    contentBox.className = 'module-item'; // Reuse card style for content container
    contentBox.style.cursor = 'default';   // Remove pointer cursor
    contentBox.style.transform = 'none';   // Remove hover effect
    contentBox.innerHTML = topic.content;  // Inject the HTML content from JSON
    container.appendChild(contentBox);

    // Show Chat Interface below content
    document.getElementById('chat-interface').classList.remove('hidden');
    
    // Context-aware System Message
    const history = document.getElementById('chat-history');
    history.innerHTML = `<div class="message system-message">Studying <strong>${topic.title}</strong>. Ask me to explain any concept!</div>`;
}

// --- CHAT LOGIC ---

const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatHistory = document.getElementById('chat-history');

// 1. Listen for the "Send" Click
sendBtn.addEventListener('click', () => {
    const question = userInput.value;
    
    // Validation: Don't send empty messages
    if (question.trim() === "") return;

    // A. Show User Message immediately
    appendMessage('User', question, 'user-message');
    userInput.value = ''; // Clear input box

    // B. Send to Python Backend
    fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: question })
    })
    .then(response => response.json())
    .then(data => {
        // C. Show AI Response
        appendMessage('AI Tutor', data.answer, 'ai-message');
    })
    .catch(error => {
        console.error('Error:', error);
        appendMessage('System', 'Error connecting to the brain.', 'system-message');
    });
});

// 2. Helper Function to Draw Bubbles
function appendMessage(sender, text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    
    chatHistory.appendChild(messageDiv);
    
    // Auto-scroll to the bottom
    chatHistory.scrollTop = chatHistory.scrollHeight; 
}