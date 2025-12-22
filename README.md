# Kgaleditsimo AI Tutors 🧠

> **A cloud-native, multi-disciplinary AI education platform engineered to democratize access to high-level academic tutoring in South Africa.**

![Status](https://img.shields.io/badge/Status-Live-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Stack](https://img.shields.io/badge/Tech-Python_|_Flask_|_Gemini_2.0-blueviolet)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 Vision & Scope

**Kgaleditsimo** ("The Beginning of Knowledge") is not merely a chatbot; it is a scalable **AI Tutoring Engine** designed to bridge the gap between rigid university syllabi and adaptive, personalized learning.

While the current MVP demonstrates proficiency in **Formal Logic** and **Analytical Chemistry**, the underlying architecture is subject-agnostic. It is built to serve as a comprehensive knowledge base for the author's multi-disciplinary focus, including:

* **Computer Science:** Algorithms, Data Structures, and C++/Qt Frameworks.
* **Cloud Engineering:** AWS Solutions Architecture & Azure Fundamentals.
* **Business Intelligence:** Entrepreneurial strategy and financial modeling.
* **Natural Sciences:** Stoichiometry, Spectroscopy, and Lab Safety.

**[🔗 View Live Demo](https://matomenkoana.github.io/kgaleditsimo-ai-tutors/)**
*(Note: As this runs on a $0.00 serverless architecture, please allow ~45 seconds for the backend cold-start.)*

---

## 🏗️ Distributed Cloud Architecture

The system utilizes a decoupled **Microservices Architecture** to ensure separation of concerns between the user interface and the generative logic engine.
graph LR
    User([Student Browser]) -->|HTTPS/JSON| Frontend[GitHub Pages Frontend]
    Frontend -->|REST API / CORS| Backend[Render.com Flask API]
    Backend -->|Secure Context Injection| AI[Google Gemini 2.0 Flash]
    AI -->|Generative Response| Backend
    Backend -->|JSON Payload| Frontend

### 🛠 Technology Stack

| Domain | Technology | Justification |
| --- | --- | --- |
| **Frontend** | **Vanilla JS / HTML5** | Zero-dependency approach for maximum performance on low-bandwidth mobile devices. |
| **Backend** | **Python 3.10 / Flask** | Lightweight WSGI framework ideal for rapid API development and AI integration. |
| **AI Core** | **Google Gemini 2.0** | Chosen for its superior reasoning capabilities in STEM and Logic tasks compared to GPT-3.5. |
| **DevOps** | **Gunicorn / Render** | Production-grade server management with automated CI/CD pipelines from GitHub. |

---

## ⚡ Engineering Challenges Solved

This project serves as a practical demonstration of **Full-Stack Cloud Competence**, addressing several key engineering hurdles:

### 1. The "Cold Start" Latency Problem

* **Challenge:** Free-tier cloud containers sleep after inactivity, causing timeouts.
* **Solution:** Implemented asynchronous `fetch` handling with visual loading states (spinners) to maintain user engagement during server wake-up cycles.

### 2. Cross-Origin Resource Sharing (CORS)

* **Challenge:** Modern browsers block requests between different domains (GitHub Pages vs. Render).
* **Solution:** Configured strict CORS headers on the Flask backend to whitelist only the specific frontend origin, preventing unauthorized API consumption while allowing legitimate traffic.

### 3. Context-Aware Prompt Engineering

* **Challenge:** Generic AI models fail at specific university module requirements.
* **Solution:** The backend injects a hidden "System Instruction" layer into every prompt. This forces the AI to adopt the persona of a strict academic tutor, limiting answers to the relevant syllabus (e.g., specific logic proofs or chemical formulas).

---

## 🧪 Installation & Local Development

To replicate this environment locally for development or testing:

### The Ingredients (Prerequisites)

* **Python 3.8+** installed.
* **Git** for version control.
* **Google AI Studio API Key** (for the Gemini model).

### The Recipe (Steps)

1. **Clone the Repository**
```bash
git clone [https://github.com/matomenkoana/kgaleditsimo-ai-tutors.git](https://github.com/matomenkoana/kgaleditsimo-ai-tutors.git)
cd kgaleditsimo-ai-tutors

```


2. **Initialize Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

```


3. **Install Dependencies**
```bash
pip install -r requirements.txt

```


4. **Configure Environment Variables**
Create a `.env` file in the root:
```env
GEMINI_API_KEY=your_key_here
PORT=5000

```


5. **Launch the API**
```bash
python app.py

```



---

## 🚀 Strategic Roadmap

The development of Kgaleditsimo follows a phased engineering roadmap:

* ✅ **Phase K (Completed):** Core Infrastructure, Cloud Deployment, and Basic AI Integration.
* 🔄 **Phase L (In Progress):** **Syllabus Injection (RAG).** implementing Retrieval-Augmented Generation to allow the AI to "read" specific PDF textbooks for Formal Logic and AWS documentation.
* 🔜 **Phase M (Planned):** **Multi-Modal Support.** enabling the user to upload images of logic circuits or chemical equations for analysis.
* 🔜 **Phase N (Planned):** **User Authentication.** Personalized learning tracks for different academic majors.

---

## 🤝 Contact & Attribution

**Lead Engineer:** Matome Nkoana


*Multidisciplinary Developer | Cloud Aspirant | Entrepreneur*

**License:** Distributed under the MIT License. Open for educational collaboration.
