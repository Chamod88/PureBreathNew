from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import os
import librosa
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
from PIL import Image
import requests
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================
# LOAD MODEL
# =======================
MODEL_PATH = os.path.join("model", "lung_disease_model.h5")

print("Loading ML model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully.")

CLASS_NAMES = ["healthy", "copd", "pneumonia"]

# =======================
# AUDIO PREPROCESSING
# =======================
def audio_to_tensor(file_bytes, sr=22050):
    # Load audio from bytes
    y, sr = librosa.load(BytesIO(file_bytes), sr=sr)
    y, _ = librosa.effects.trim(y)
    y = librosa.util.normalize(y)

    # Mel spectrogram
    mel = librosa.feature.melspectrogram(y=y, sr=sr)
    mel_db = librosa.power_to_db(mel, ref=np.max)

    # Convert to image
    fig = plt.figure(figsize=(3, 3))
    plt.axis("off")
    librosa.display.specshow(mel_db, sr=sr)
    buf = BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight", pad_inches=0)
    plt.close(fig)

    # Load image and resize
    buf.seek(0)
    img = Image.open(buf).convert("RGB")
    img = img.resize((224, 224))

    # Convert to numpy tensor
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    return img_array

# =======================
# ROUTES
# =======================
@app.get("/")
def root():
    return {"message": "PureBreath backend is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...), userId: str = Form(None)):
    start_time = time.time()
    file_bytes = await file.read()

    # Get audio duration
    try:
        y, sr = librosa.load(BytesIO(file_bytes), sr=None)
        duration = len(y) / sr
    except:
        duration = None

    # Preprocess audio
    tensor = audio_to_tensor(file_bytes)

    # Run prediction
    preds = model.predict(tensor)
    pred_index = int(np.argmax(preds))
    confidence = float(np.max(preds))

    disease = CLASS_NAMES[pred_index]
    processing_time = int((time.time() - start_time) * 1000)  # in milliseconds

    # Save analysis to database if userId provided
    if userId:
        try:
            analysis_data = {
                "userId": userId,
                "fileName": file.filename,
                "fileSize": len(file_bytes),
                "duration": duration,
                "mimeType": file.content_type or "audio/wav",
                "prediction": disease,
                "confidence": confidence,
                "processingTime": processing_time,
                "modelVersion": "1.0.0"
            }

            # Call Node.js API to save analysis
            response = requests.post("http://localhost:3000/api/analysis/save", json=analysis_data, timeout=5)
            if response.status_code != 201:
                print(f"Failed to save analysis: {response.text}")
        except Exception as e:
            print(f"Error saving analysis: {e}")

    return {
        "prediction": disease,
        "confidence": round(confidence, 3)
    }
