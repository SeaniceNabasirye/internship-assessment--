import os
import time
import requests
from dotenv import load_dotenv


load_dotenv()

API_TOKEN = os.getenv("SUNBIRD_API_TOKEN")

if not API_TOKEN:
    raise EnvironmentError("SUNBIRD_API_TOKEN is not set. Add it to your .env file.")

HEADERS = {"Authorization": f"Bearer {API_TOKEN}"}


def sunflower_chat(instruction: str, input_text: str):

    if not instruction or instruction.strip() == "":
        raise ValueError("Instruction cannot be empty")

    if len(instruction) > 3500:
        instruction = instruction[:3500]

    url = "https://api.sunbird.ai/tasks/sunflower_simple"

    for attempt in range(2):
        try:
            response = requests.post(
                url,
                headers=HEADERS,
                data={"instruction": instruction},  # only instruction, no input field
                timeout=300
            )
            print("sunflower_chat status:", response.status_code)
            print("sunflower_chat body:", response.text[:500])
            response.raise_for_status()
            return response.json()["response"]

        except requests.exceptions.ConnectionError as e:
            if attempt == 0:
                print("Connection dropped, retrying in 5s...")
                time.sleep(5)
            else:
                raise RuntimeError(f"Sunbird API unreachable after 2 attempts: {e}")

def speech_to_text(file_path: str):

    url = "https://api.sunbird.ai/tasks/modal/stt"

    for attempt in range(2):
        try:
            with open(file_path, "rb") as audio_file:
                response = requests.post(
                    url,
                    headers=HEADERS,
                    files={"audio": audio_file},
                    timeout=300
                )
            print("speech_to_text status:", response.status_code)
            print("speech_to_text body:", response.text[:500])
            response.raise_for_status()
            return response.json()["audio_transcription"]

        except requests.exceptions.ConnectionError as e:
            if attempt == 0:
                print("Connection dropped, retrying in 5s...")
                time.sleep(5)
            else:
                raise RuntimeError(f"STT API unreachable after 2 attempts: {e}")


def text_to_speech(text: str):

    url = "https://api.sunbird.ai/tasks/modal/tts"

    for attempt in range(2):
        try:
            response = requests.post(
                url,
                headers=HEADERS,
                json={"text": text, "speaker_id": 248, "response_mode": "url"},
                timeout=300
            )
            print("text_to_speech status:", response.status_code)
            print("text_to_speech body:", response.text[:1000])  # print full error
            response.raise_for_status()

            data = response.json()
            audio_url = data.get("audio_url")

            if not audio_url:
                raise RuntimeError(f"No audio_url in response: {data}")

            audio_response = requests.get(audio_url, timeout=120)
            audio_response.raise_for_status()
            return audio_response.content

        except requests.exceptions.ConnectionError as e:
            if attempt == 0:
                print("TTS connection dropped, retrying in 5s...")
                time.sleep(5)
            else:
                raise RuntimeError(f"TTS API unreachable after 2 attempts: {e}")
        except requests.exceptions.Timeout:
            if attempt == 0:
                print("TTS timed out, retrying...")
                time.sleep(5)
            else:
                raise RuntimeError("TTS API timed out after 2 attempts")