# 🚀 AI Appointment Scheduler Assistant

## 📖 Description

The AI Appointment Scheduler Assistant converts natural-language or image-based inputs into clean, structured appointment data using Google Gemini AI. It processes user text or OCR-extracted content, identifies key appointment details (date, time, department), normalizes them into ISO formats, applies guardrails for ambiguous cases, and returns a final validated appointment JSON.

## 🧰 Tech Stack Used

**Frontend:** React, Vite, TailwindCSS  
**Backend:** Node.js, Express, Multer, Joi, Luxon  
**AI:** Gemini Flash (NLP), Gemini Vision (OCR)  
**Deployment:** Render, GitHub  

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
### 2️⃣ Setup Backend Environment variables 
```bash
PORT=5000
GOOGLE_API_KEY=AIzaSyAyQdNxjD3YwmcHNWgltVYbkph6JC1Ry0w
```
### 3️⃣ Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
### 4️⃣ Setup Backend
```bash
cd backend
npm install
npm run dev
```

## 🔄 API Calls Flow

1. **User submits input**  
   - Either text or an uploaded image.

2. **Frontend sends request**  
   - Sends a `POST /api/appointments/parse` request with `mode`, `text` or `image`.

3. **Backend receives request**  
   - Multer handles image upload (if any).  
   - Controller starts the AI pipeline.

4. **Step 1: OCR / Text Extraction**  
   - If text → use directly.  
   - If image → Gemini Vision extracts text.

5. **Step 2: Entity Extraction**  
   - Gemini Flash extracts:  
     `date_phrase`, `time_phrase`, `department`.

6. **Step 3: Normalization**  
   - Phrases converted into ISO date/time + canonical department.

7. **Guardrail Check**  
   - If any ambiguity → return:  
     `{ "status": "needs_clarification" }`.

8. **Step 4: Final JSON**  
   - Build structured appointment response.

9. **Frontend displays all steps**  
   - Shows step1 → step2 → step3 → final output. 

---

## 📘 API usage examples

### 📡 API Endpoints

#### **POST /api/appointments/parse**
Parses user input (text or image) and returns the full AI pipeline output.

**Request (text mode):**
```json
{
  "mode": "text",
  "text": "Book dentist next Friday at 3pm"
}
```

**Response (success):**
```json
{
  "final": {
    "appointment": {
      "department": "Dentistry",
      "date": "2025-09-26",
      "time": "15:00",
      "tz": "Asia/Kolkata"
    },
    "status": "ok"
  }
}

```
**Response (if clarification needed):**
```json
{
  "status": "needs_clarification",
  "message": "Ambiguous date/time or department"
}
```


