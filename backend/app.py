import os
import json  # <--- NEW IMPORT
from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# --- AI CONFIGURATION ---
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-flash-latest')

app = Flask(__name__)
CORS(app)

# --- ROUTE 1: Home ---
@app.route('/')
def home():
    return "System Online: Kgaleditsimo AI Backend is active."

# --- ROUTE 2: Get Curriculum (UPDATED) ---
@app.route('/api/curriculum')
def get_curriculum():
    try:
        # Get the directory where app.py is located
        base_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Join it with the filename to get the full path
        json_path = os.path.join(base_dir, 'curriculum.json')
        
        with open(json_path, 'r') as f:
            data = json.load(f)
        return jsonify(data)
        
    except FileNotFoundError:
        print(f"ERROR: Could not find file at {json_path}") # Print error to terminal for debugging
        return jsonify({"error": "Curriculum file not found"}), 500
    except json.JSONDecodeError:
        print(f"ERROR: File at {json_path} is not valid JSON")
        return jsonify({"error": "Invalid JSON format"}), 500

# --- ROUTE 3: Chat with AI ---
@app.route('/api/chat', methods=['POST'])
def chat():
    user_data = request.json
    user_question = user_data.get('question')
    
    try:
        system_instruction = "You are an expert Tutor for Chemistry and Computer Science. Keep answers concise, accurate, and academic."
        full_prompt = f"{system_instruction} Student asks: {user_question}"
        
        response = model.generate_content(full_prompt)
        ai_answer = response.text
        
        return jsonify({"answer": ai_answer})
        
    except Exception as e:
        print(f"AI Error: {e}")
        return jsonify({"answer": "I'm having trouble connecting to the brain right now."}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)