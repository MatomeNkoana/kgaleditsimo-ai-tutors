from flask import Flask, jsonify , request
from flask_cors import CORS


# 1. The Database variable
curriculum_data = {
    "subjects": [
        {
            "id": "subj-chem",
            "name": "Chemistry",
            "description": "The scientific study of the properties and behavior of matter.",
            "modules": [
                { "title": "Organic Chemistry", "id": "chem-org" },
                { "title": "Inorganic Chemistry", "id": "chem-inorg" },
                { 
                    "title": "Analytical Chemistry", 
                    "id": "chem-ana",
                    "topics": [
                        { "title": "Significant Figures", "content": "Non-zero digits are always significant." },
                        { "title": "Titration", "content": "Determining concentration using a known solution." }
                    ]
                },
                { "title": "Physical Chemistry", "id": "chem-phys" }
            ]
        },
        {
            "id": "subj-cs",
            "name": "Computer Science",
            "description": "The study of computation, automation, and information.",
            "modules": [
                { "title": "Formal Logic", "id": "cs-logic" },
                { "title": "Theoretical Computer Science", "id": "cs-theory" },
                { "title": "Artificial Intelligence", "id": "cs-ai" },
                { "title": "Data Structures & Algorithms", "id": "cs-dsa" },
                { "title": "Software Engineering Projects", "id": "cs-se-proj" }
            ]
        }
    ]
}
# 2. Initialize the Flask application
app = Flask(__name__)
# TODO: SECURITY WARNING
# Current setting allows ALL origins ('*') for development convenience.
# BEFORE DEPLOYING: Change to -> CORS(app, origins=["https://matomenkoana.github.io"])
CORS(app)
# 3. Define a "Route" (A specific URL)
# When someone visits the root URL ('/'), run this function.
@app.route('/')
def home():
    return "System Online: Kgaleditsimo AI Backend is running."
# When someone visits the root URL ('/api/curriculum'), run this function. That loads the data
@app.route('/api/curriculum')
def get_curriculum():
    #jsonify converts the Python dictionary into a JSON response
    return jsonify(curriculum_data)
# Chat Endpoint (POST)
# 'methods=['POST']' means this route only accepts data submission, not casual browsing.
@app.route('/api/chat', methods=['POST'])
def chat():
    # A. Get the data sent by the frontend
    user_data = request.json
    user_question = user_data.get('question')

    # B. (Placeholder) AI Logic goes here
    # For now, we will just simulate intelligence.
    print(f"User asked: {user_question}") # Print to your terminal
    
    mock_answer = f"I received your question: '{user_question}'. This is a mock AI response."

    # C. Send the answer back
    return jsonify({"answer": mock_answer})
# 4. Start the Server
# debug=True allows the server to auto-restart when you save changes.
if __name__ == '__main__':
    app.run(debug=True)