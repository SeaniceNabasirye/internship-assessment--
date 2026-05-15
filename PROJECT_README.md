## SunVoice AI App


SunVoice is a GenAI web application that processes text or audio through an intelligent pipeline powered by Sunbird AI. Users can input English text or upload audio files, which are then transcribed, summarized, translated into Ugandan local languages (Luganda, Runyankole, Ateso, Lugbara, Acholi), and converted back to speech, creating a complete multilingual content processing experience.

## Architecture Overview

The application implements a 6-step AI pipeline using Sunbird AI's APIs:

```
Input (Text/Audio) → STT → Summarize → Translate → TTS → Output
     ↓               ↓        ↓          ↓         ↓       ↓
  User Input    Sunbird   Sunflower  Sunflower  Sunbird  Audio +
  (Frontend)      STT       LLM        LLM       TTS    Text Results
```

### Pipeline Components & Sunbird Endpoints:
- **Input**: User provides text or audio via Next.js frontend
- **STT**: `POST /tasks/modal/stt` - Sunbird Speech-to-Text transcribes audio to English
- **Summarize**: `POST /tasks/sunflower_simple` - Sunflower LLM creates concise summaries
- **Translate**: `POST /tasks/sunflower_simple` - Sunflower LLM translates to target language
- **TTS**: `POST /tasks/modal/tts` - Sunbird Text-to-Speech generates audio
- **Output**: Display all intermediate results with playable audio

### Tech Stack:
- **Backend**: FastAPI (Python) with async processing
- **Frontend**: Next.js 16 (React/TypeScript)
- **APIs**: Sunbird AI STT/TTS + Sunflower LLM

## Local Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- Sunbird AI API token ([Get one here](https://api.sunbird.ai/))

### 1. Clone Repository
```bash
git clone https://github.com/SeaniceNabasirye/internship-assessment.git
cd internship-assessment
```

### 2. Programming Exercises (Part 1)
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run tests to verify exercises work
pytest
```

### 3. Backend Setup (Part 2)
```bash
cd backend

# Use same virtual environment from step 2
pip install fastapi uvicorn python-multipart mutagen

# Configure environment variables
cp .env.example .env
# Edit .env and add your Sunbird API token:
# SUNBIRD_API_TOKEN=your_actual_token_here

# Start backend server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Backend runs on `http://127.0.0.1:8000`

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend runs on `http://localhost:3000`

### 5. Test the Application
1. Open `http://localhost:3000` in your browser
2. Try text input: Enter English text, select target language, click "Process"
3. Try audio input: Upload audio file (.mp3, .wav, etc.), select language, process
4. Verify all pipeline steps show results and audio plays correctly

## Environment Variables

| Variable | Description | Required | Location |
|----------|-------------|----------|----------|
| `SUNBIRD_API_TOKEN` | Your Sunbird AI API authentication token from [api.sunbird.ai](https://api.sunbird.ai/) | Yes | `backend/.env` |

## Usage

### Text Processing Workflow
1. **Select Input Mode**: Click "✏️ Text Input" tab
2. **Enter Content**: Type or paste English text in the textarea
3. **Choose Language**: Select target Ugandan language from dropdown
4. **Process**: Click "▶ Process" button and wait 1-3 minutes
5. **View Results**: See original text → summary → translation → generated audio

### Audio Processing Workflow
1. **Select Input Mode**: Click "🎙️ Audio Upload" tab
2. **Upload File**: Choose audio file (supported: .mp3, .wav, .ogg, .m4a, .aac, .mp4, .webm)
3. **Choose Language**: Select target language for translation
4. **Process**: Click "▶ Process" and wait 1-3 minutes
5. **View Results**: See transcript → summary → translation → generated audio

### Example Screenshots
![Text Input Interface]

<img width="1313" height="886" alt="image" src="https://github.com/user-attachments/assets/b9d66ad1-525d-49da-a601-35dddfe8fecb" />

![Audio Upload Interface]

<img width="1307" height="856" alt="image" src="https://github.com/user-attachments/assets/d81f1b77-c60f-42ba-89c8-1228ff10077e" />


![Pipeline Results]

<img width="1539" height="819" alt="image" src="https://github.com/user-attachments/assets/9dd76b39-3e15-49cc-b757-8f4c96e74131" />



## Deployed Links

### Frontend (Vercel)
https://internship-assessment-b5ns.vercel.app/

### Backend API (Render)
https://internship-assessment-05at.onrender.com

The frontend connects to the deployed FastAPI backend hosted on Render.

Try the application live without any local setup required.

## Known Limitations

### Audio Constraints
- **Maximum Duration**: 5-minute audio files (enforced with clear error messages)
- **File Size**: Recommend files under 10MB to avoid timeouts
- **Format Support**: While many formats accepted, .mp3 and .wav provide best compatibility

### Language Support
- **Translation**: Limited to 5 Ugandan languages (Luganda, Runyankole, Ateso, Lugbara, Acholi)
- **Input Language**: STT and initial processing expect English audio/text

### Technical Limitations
- **Processing Time**: Complete pipeline takes 1-3 minutes depending on content length
- **API Dependencies**: Requires active Sunbird AI API token and stable internet
- **Service Availability**: Some Sunbird services may be temporarily unavailable
- **Concurrent Users**: Backend designed for development/demo use, not production scale

### Error Handling
- **File Validation**: Duration and size checks with user-friendly error messages
- **API Failures**: Graceful degradation when TTS fails (shows text results only)
- **Network Issues**: Retry logic for connection drops, timeout handling

## Project Structure

```
├── exercises/
│   └── basics.py            # Part 1: Programming exercises (collatz, distinct_numbers)
├── tests/
│   └── test_basics.py       # Unit tests for programming exercises
├── backend/
│   ├── main.py              # FastAPI server with CORS and endpoints
│   ├── sunbird_client.py    # Sunbird API wrapper with retry logic
│   ├── pipeline.py          # Core processing pipeline functions
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variable template
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main React component with UI
│   │   ├── layout.tsx       # App layout and metadata
│   │   └── globals.css      # Global styles
│   ├── package.json         # Node.js dependencies
│   └── next.config.ts       # Next.js configuration
├── requirements.txt         # Root Python dependencies for exercises
├── constants.py             # Test constants for programming exercises
└── README.md                # This documentation
```

## API Endpoints

- `POST /process-text`: Process text input through full pipeline
- `POST /process-audio`: Process audio file through full pipeline
- `GET /audio`: Serve generated audio file

---

**Built with ❤️ using Sunbird AI • Sunflower LLM • Next.js • FastAPI**

*This project completes all 3 parts of the Sunbird AI Internship Assessment: Programming Exercises, GenAI Application, and Documentation & Deployment.*
