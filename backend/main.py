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

# =======================
# FastAPI App Setup
# =======================
app = FastAPI(title="PureBreath Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins or specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================
# Lazy Model Loading
# =======================
_model = None
CLASS_NAMES = ["healthy", "copd", "pneumonia"]

def get_model():
    global _model
    if _model is None:
        model_path = os.path.join("model", "lung_disease_model.h5")
        print("Loading ML model...")
        _model = tf.keras.models.load_model(model_path, compile=False)
        print("Model loaded successfully.")
    return _model

# =======================
# Audio Preprocessing
# =======================
def audio_to_tensor(file_bytes, sr=22050):
    # Load audio
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
# Routes
# =======================
@app.get("/")
def root():
    return {"message": "PureBreath backend is running"}

@app.get("/favicon.ico")
def favicon():
    return {}

@app.post("/predict")
async def predict(file: UploadFile = File(...), userId: str = Form(None)):
    start_time = time.time()
    file_bytes = await file.read()

    # Audio duration
    try:
        y, sr = librosa.load(BytesIO(file_bytes), sr=None)
        duration = len(y) / sr
    except:
        duration = None

    # Preprocess
    tensor = audio_to_tensor(file_bytes)

    # Load model lazily
    model = get_model()

    # Predict
    preds = model.predict(tensor)
    pred_index = int(np.argmax(preds))
    confidence = float(np.max(preds))
    disease = CLASS_NAMES[pred_index]
    processing_time = int((time.time() - start_time) * 1000)  # ms

    # Save analysis if userId is provided
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
            api_url = os.getenv("API_URL", "http://localhost:3000")
            response = requests.post(
                f"{api_url}/api/analysis/save",
                json=analysis_data,
                timeout=5
            )
            if response.status_code != 201:
                print(f"Failed to save analysis: {response.text}")
        except Exception as e:
            print(f"Error saving analysis: {e}")

    return {
        "prediction": disease,
        "confidence": round(confidence, 3)
    }
