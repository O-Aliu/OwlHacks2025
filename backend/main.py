print("Flask backend starting...")

from huggingface_hub import InferenceClient
from transformers import AutoTokenizer
import torch
import os
import sounddevice as sd
from scipy.io.wavfile import write
from flask import Flask, request, jsonify
from flask_cors import CORS
import wavio as wv
from openai import OpenAI


app = Flask(__name__)
CORS(app)


def record_audio(dur):
    freq = 16000
    maxNum = -1
    record = sd.rec(int(dur*freq), samplerate=freq, channels=1)
    print("recording audio")
    sd.wait()
    print("recording finished")

    print("audio saving")
    files = os.listdir("audio/")
    for file in files:
        num = int(file.replace("audio","").replace(".wav", ""))
        if (num > maxNum):
            maxNum = num
    nextNum = maxNum + 1
    newFileName = f"audio/audio{nextNum}.wav"
    try:
        write(newFileName, freq, record)
    except Exception as e:
        print("Err", e)
        return None
    print("audio saved")
    return newFileName


def transcribe(filePath):
    client = InferenceClient(provider="hf-inference")
    transcript = client.automatic_speech_recognition(
        audio=filePath,
        model="openai/whisper-large-v3"
    )
    return transcript.text

def ai_feedback(scenario, user_response):
    modelName = "mistralai/Mistral-7B-Instruct-v0.2"
    tokenizer = AutoTokenizer.from_pretrained(modelName)

    client = OpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=os.environ["owlHacks2025Two"],
    )

    completion = client.chat.completions.create(
        model="mistralai/Mistral-7B-Instruct-v0.2:featherless-ai",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a friendly AI coach helping someone practice social interactions. "
                    "Always be positive, encouraging, and clear."
                )
            },
            {
                "role": "user",
                "content": f"""
Scenario: "{scenario}"
User Response: "{user_response}"

Please:
1. Comment on what was good about the response.
2. Suggest one friendly improvement or follow-up they could try.

Keep your feedback short, clear, and encouraging.
"""
            }
        ],
    )
    return completion.choices[0].message.content


@app.route('/record_transcribe_feedback', methods=['POST'])
def record_transcribe_feedback_endpoint():
    print("/record_transcribe_feedback endpoint called")
    data = request.get_json()
    dur = data.get('duration')
    scenario = data.get('scenario')
    if dur is None or not scenario:
        return jsonify({"error": "Missing duration or scenario"}), 400
    try:
        filename = record_audio(float(dur))
        if not filename:
            return jsonify({"error": "Recording failed"}), 500
        script = transcribe(filename)
        print(f"Transcript: {script}")
        print(f"Scenario: {scenario}")
        print(f"User Response (to model): {script}")
        feedback = ai_feedback(scenario, script)
        return jsonify({"filename": filename, "transcript": script, "feedback": feedback}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)