const container = document.getElementById('curriculum-container');
let allData = {}; // Variable to store the fetched data

// 1. Fetch Data on Load
fetch('http://127.0.0.1:5000/api/curriculum')
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
    // Check if topics exist
    if (!module.topics) {
        alert("No topics added for this module yet!");
        return;
    }

    container.innerHTML = ''; // Clear the screen
    // SHOW Chat when inside a module
    document.getElementById('chat-interface').classList.remove('hidden');

    // Update the System Message to be context-aware
    const history = document.getElementById('chat-history');
    history.innerHTML = `<div class="message system-message">You are studying <strong>${module.title}</strong>. How can I help?</div>`;
    // Add Back Button
    const backBtn = document.createElement('button');
    backBtn.innerText = "← Back to Subjects";
    backBtn.onclick = renderMainMenu; // Go back when clicked
    container.appendChild(backBtn);

    // Add Module Title
    const title = document.createElement('h2');
    title.innerText = module.title;
    container.appendChild(title);

    // List the Topics
    const topicList = document.createElement('ul');
    module.topics.forEach(topic => {
        const item = document.createElement('li');
        item.innerText = topic.title + ": " + topic.content;
        topicList.appendChild(item);
    });
    container.appendChild(topicList);
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
    fetch('http://127.0.0.1:5000/api/chat', {
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