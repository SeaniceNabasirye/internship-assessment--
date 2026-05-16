import asyncio
import io
import os
import tempfile
from mutagen import File as MutagenFile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from pipeline import (
    summarize_text,
    translate_text,
    transcribe_audio,
    generate_speech,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextRequest(BaseModel):
    text: str
    language: str


@app.post("/process-text")
async def process_text(data: TextRequest):
    try:
        loop = asyncio.get_event_loop()

        summary = await loop.run_in_executor(None, summarize_text, data.text)
        translated = await loop.run_in_executor(None, translate_text, summary, data.language)

        audio_url = None
        try:
            await loop.run_in_executor(None, generate_speech, translated)
            audio_url = "https://internship-assessment-05at.onrender.com/audio"
        except Exception as tts_error:
            print(f"TTS failed (skipping): {tts_error}")

        return {
            "original": data.text,
            "summary": summary,
            "translated": translated,
            "audio_url": audio_url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/process-audio")
async def process_audio(
    file: UploadFile = File(...),
    language: str = "Luganda"
):
    try:
        audio_data = await file.read()

        # Check audio duration using temp file
       # Check audio duration using temp file
        temp_path = None
        try:
            suffix = os.path.splitext(file.filename)[1] if file.filename else ".wav"
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(audio_data)
                temp_path = tmp.name

            audio_check = MutagenFile(temp_path)
            print(f"Audio check result: {audio_check}")

            if audio_check is not None:
                duration = audio_check.info.length
                print(f"Audio duration: {duration} seconds")
                if duration > 300:
                    raise HTTPException(
                        status_code=400,
                        detail="Audio file too long. Maximum duration is 5 minutes."
                    )
            else:
                # Fallback: estimate duration from file size
                # Average audio is ~1MB per minute at 128kbps
                # 5 minutes = ~10MB to be safe
                if len(audio_data) > 10 * 1024 * 1024:
                    raise HTTPException(
                        status_code=400,
                        detail="Audio file too long. Maximum duration is 5 minutes."
                    )

        except HTTPException:
            raise
        except Exception as e:
            print(f"Duration check failed: {e}")
            # Fallback size check
            if len(audio_data) > 10 * 1024 * 1024:
                raise HTTPException(
                    status_code=400,
                    detail="Audio file too long. Maximum duration is 5 minutes."
                )
        finally:
            if temp_path and os.path.exists(temp_path):
                os.unlink(temp_path)

        loop = asyncio.get_event_loop()        
                
        # Try transcription
        try:
            transcript = await loop.run_in_executor(None, transcribe_audio, audio_data, file.filename)
        except Exception as stt_error:
            print(f"STT failed: {stt_error}")
            raise HTTPException(
                status_code=503,
                detail="Speech-to-text is currently unavailable. Please try again later or use text input instead."
            )

        summary = await loop.run_in_executor(None, summarize_text, transcript)
        translated = await loop.run_in_executor(None, translate_text, summary, language)

        audio_url = None
        try:
            await loop.run_in_executor(None, generate_speech, translated)
            audio_url = "https://internship-assessment-05at.onrender.com/audio"
        except Exception as tts_error:
            print(f"TTS failed (skipping): {tts_error}")

        return {
            "transcript": transcript,
            "summary": summary,
            "translated": translated,
            "audio_url": audio_url
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/audio")
def get_audio():
    return FileResponse(
        "generated_audio.mp3",
        media_type="audio/mpeg"
    )