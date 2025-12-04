# 🚀 AI Appointment Scheduler Assistant

## 📘 Project Title
AI Appointment Scheduler Assistant  
Convert natural-language or image-based appointment requests into clean, structured JSON using **MERN + Gemini AI**.

---

## 📖 Description
The AI Appointment Scheduler Assistant processes both text and images to extract appointment details using Google Gemini AI. It performs:

- OCR (for image inputs)
- Entity extraction (date, time, department)
- Normalization into ISO format (Asia/Kolkata)
- Guardrail checks for ambiguity
- Final structured appointment JSON generation

This project is built using:
- **Node.js + Express** for backend
- **MongoDB + Mongoose** for storage
- **Google Gemini AI** for OCR & NLP
- **React + TailwindCSS + Vite** for UI

---

## ✨ Features
- 📷 **OCR Support:** Extract text from handwritten notes or screenshots  
- 🔍 **Entity Extraction:** Identify date, time, and department  
- 🗓 **Normalization:** Convert phrases like *"next Friday at 3pm"* to ISO datetime  
- ⚠️ **Guardrails:** Returns `needs_clarification` for ambiguous inputs  
- 📦 **Final JSON Output:** Structured appointment object  
- 🎨 **Modern UI:** Built with TailwindCSS  

---

## ⚙️ Installation / Setup

### 1️⃣ Clone project
```bash
git clone https://github.com/Udaybisone/ai-appointment-scheduler.git
cd ai-appointment-scheduler
```

### 2️⃣ Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
### 3️⃣ Setup Backend
```bash
cd backend
npm install
npm run dev
```
