import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load your key
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("--- Available Models ---")
# Ask Google for the list
for m in genai.list_models():
    # Only show models that can generate text (chat)
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)