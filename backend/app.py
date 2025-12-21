from flask import Flask, jsonify


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
                { "title": "Analytical Chemistry", "id": "chem-ana" },
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

# 3. Define a "Route" (A specific URL)
# When someone visits the root URL ('/'), run this function.
@app.route('/')
def home():
    return "System Online: Kgaleditsimo AI Backend is running."

@app.route('/api/curriculum')
def get_curriculum():
    #jsonify converts the Python dictionary into a JSON response
    return jsonify(curriculum_data)

# 4. Start the Server
# debug=True allows the server to auto-restart when you save changes.
if __name__ == '__main__':
    app.run(debug=True)