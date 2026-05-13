import os
import tempfile
from concurrent.futures import ThreadPoolExecutor

from sunbird_client import (
    sunflower_chat,
    speech_to_text,
    text_to_speech
)

executor = ThreadPoolExecutor()


def summarize_text(text: str):
    instruction = f"Summarize the following text clearly and briefly in English only. Output only the summary, nothing else:\n\n{text}"
    return sunflower_chat(instruction, "")


def translate_text(text: str, language: str):
    instruction = f"Translate the following English text into {language}. Output only the translated text, nothing else:\n\n{text}"
    result = sunflower_chat(instruction, "")
    
    # If translation came back empty, return a clear message
    if not result or result.strip() == "":
        return f"[Translation to {language} unavailable at this time. Please try again.]"
    
    return result

def transcribe_audio(audio_bytes: bytes, filename: str):
    suffix = os.path.splitext(filename)[1] if filename else ".wav"
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
            temp.write(audio_bytes)
            temp_path = temp.name
        return speech_to_text(temp_path)
    finally:
        if temp_path and os.path.exists(temp_path):
            os.unlink(temp_path)


def generate_speech(text: str):
    audio = text_to_speech(text)
    output_path = "generated_audio.mp3"
    with open(output_path, "wb") as f:
        f.write(audio)
    return output_path