# Kgaleditsimo AI Tutors 🧠

> **A cloud-native, multi-disciplinary AI education platform engineered to democratize access to high-level academic tutoring in South Africa.**

![Status](https://img.shields.io/badge/Status-Live-success)
![Version](https://img.shields.io/badge/Version-1.2.0-blue)
![Stack](https://img.shields.io/badge/Tech-Python_|_Flask_|_Gemini_2.0-blueviolet)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 Vision & Scope

**Kgaleditsimo** ("The Beginning of Knowledge") is not merely a chatbot; it is a scalable **AI Tutoring Engine** designed to bridge the gap between rigid university syllabi and adaptive, personalized learning.

The platform is currently live with a robust **Analytical Chemistry** curriculum aligned with *Fundamentals of Analytical Chemistry (Skoog, 10th Ed)*. It serves as a comprehensive knowledge base for the author's multi-disciplinary focus, including:

* **Natural Sciences:** Analytical Chemistry (Titrimetry, Gravimetry, Spectroscopy).
* **Computer Science:** Formal Logic III and Algorithms.
* **Cloud Engineering:** AWS Solutions Architecture & Azure Fundamentals.

**[🔗 View Live Demo](https://matomenkoana.github.io/kgaleditsimo-ai-tutors/)**
*(Note: As this runs on a serverless architecture, please allow ~45 seconds for the backend cold-start.)*

---

## 🏗 System Architecture

The application follows a decoupled **Client-Server** architecture designed for low-latency mobile access in South Africa.

| Domain | Technology | Implementation Details |
| --- | --- | --- |
| **Frontend** | **Vanilla JS / HTML5 / CSS3** | Zero-dependency, responsive SPA (Single Page Application) with a custom router for efficient navigation. Optimized for mobile viewports. |
| **Backend** | **Python 3.10 / Flask** | Lightweight REST API serving structured curriculum data (JSON) and brokering AI requests. |
| **AI Core** | **Google Gemini 2.0 Flash** | Selected for high-speed reasoning in STEM tasks. Configured with a "Socratic Tutor" system persona. |
| **Deployment** | **Render + GitHub Pages** | Hybrid deployment: Backend on Render (Gunicorn), Frontend on GitHub Pages for optimal caching. |

---

## ⚡ Key Engineering Features

This project demonstrates practical **Full-Stack Competence**, solving specific user experience and data structure challenges:

### 1. Dynamic Curriculum Engine
* **Feature:** A modular JSON-based data structure that decouples content from code.
* **Benefit:** Allows for instant updates to the syllabus (e.g., adding "Redox Titrations") without redeploying the frontend codebase. Currently structured to match *Skoog 10th Edition*.

### 2. The "Lesson Dashboard" Interface
* **Feature:** A split-screen workspace (Desktop) and stacked layout (Mobile) that displays rigorous academic content alongside an interactive AI tutor.
* **Tech:** Implemented using CSS Grid/Flexbox with `box-sizing: border-box` and intrinsic sizing (`height: auto`) to prevent layout shifts on varying device sizes.

### 3. Smart State Management
* **Feature:** Custom JavaScript routing logic (`renderModuleList`, `showLessonContent`) that preserves navigation history.
* **Benefit:** Users can navigate deep into a topic (e.g., Titration -> Introduction) and return to the parent module without losing context or triggering page reloads.

### 4. Interactive Learning Aids
* **Feature:** Embedded "Quick Check" quizzes and real-time Chat Interface.
* **UX:** Includes "Enter-to-Send" functionality, auto-scrolling chat history, and visual feedback for quiz answers.

---

## 🧪 Installation & Local Development

To replicate this environment locally:

### Prerequisites
* **Python 3.8+**
* **Git**
* **Google Gemini API Key**

### Steps

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
pip install -r backend/requirements.txt
```
4. **Configure Environment Create a ```.env``` file in the root:**
```code snippert
GEMINI_API_KEY=your_key_here
PORT=5000
```
5. **Launch the API**
```bash
python backend/app.py
```
*Frontend runs via Live Server or by opening ```index.html```*

## 🚀 Strategic Roadmap

The development of Kgaleditsimo follows a phased engineering roadmap:

* ✅ **Phase K (Completed):** Core Infrastructure, Split-Screen Dashboard, Mobile Responsiveness, and CI/CD Pipeline.
* 🔄 **Phase L (In Progress):** **Content Population.** rigorously populating the "Titrimetric Methods" and "Formal Logic" modules with university-grade content and quizzes.
* 🔜 **Phase M (Planned):** **Syllabus Injection (RAG).** implementing Retrieval-Augmented Generation to allow the AI to cite specific page numbers from uploaded PDF textbooks.
* 🔜 **Phase N (Planned):** **User Authentication.** Personalized learning tracks and progress saving.

---

## 🤝 Contact & Attribution

**Lead Engineer:** Matome Nkoana
*Multidisciplinary Developer | Cloud Aspirant | Entrepreneur*

**License:** Distributed under the MIT License. Open for educational collaboration.