import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Load the secrets from .env
load_dotenv()

# 2. Configure the AI Model
# We get the key safely from the environment
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# We select the 'flash' model because it is fast and free-tier friendly
model = genai.GenerativeModel('gemini-flash-latest')

app = Flask(__name__)

# TODO: SECURITY WARNING
# BEFORE DEPLOYING: Change to -> CORS(app, origins=["https://matomenkoana.github.io"])
CORS(app)

# --- DATA STORE ---
curriculum_data = {
    "subjects": [
        {
            "id": "subj-chem",
            "name": "Chemistry",
            "description": "The scientific study of the properties and behavior of matter.",
            "modules": [
                { "title": "Organic Chemistry", "id": "chem-org" },
                { "title": "Inorganic Chemistry", "id": "chem-inorg" },
                { "title": "Analytical Chemistry", "id": "chem-ana", "topics": [
                    { "title": "Significant Figures", "content": "Non-zero digits are always significant." },
                    { "title": "Titration", "content": "Determining concentration using a known solution." }
                ]},
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

@app.route('/')
def home():
    return "System Online: Kgaleditsimo AI Backend is active."

@app.route('/api/curriculum')
def get_curriculum():
    return jsonify(curriculum_data)

@app.route('/api/chat', methods=['POST'])
def chat():
    # A. Get User Input
    user_data = request.json
    user_question = user_data.get('question')
    
    # B. AI Processing
    try:
        # Create a "System Prompt" to give the AI a persona
        system_instruction = "You are an expert Tutor for Chemistry and Computer Science. Keep answers concise, accurate, and academic. "
        full_prompt = f"{system_instruction} Student asks: {user_question}"
        
        # Send to Google
        response = model.generate_content(full_prompt)
        ai_answer = response.text
        
        return jsonify({"answer": ai_answer})
        
    except Exception as e:
        print(f"AI Error: {e}")
        return jsonify({"answer": "I'm having trouble connecting to the brain right now. Please try again."}), 500

if __name__ == '__main__':
    app.run(debug=True)