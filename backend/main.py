from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import os
import librosa
import numpy as np
from io import BytesIO
from PIL import Image
import requests
import time

# =======================
# APP SETUP
# =======================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================
# MODEL CONFIG
# =======================
_model = None
CLASS_NAMES = ["healthy", "copd", "pneumonia"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "lung_disease_model.h5")

# =======================
# LAZY MODEL LOADING
# =======================
def get_model():
    global _model
    if _model is None:
        print("Loading ML model...")
        _model = tf.keras.models.load_model(MODEL_PATH, compile=False)
        print("Model loaded successfully.")
    return _model

# =======================
# MEL SPECTROGRAM → IMAGE
# =======================
def mel_to_image(mel_db: np.ndarray) -> Image.Image:
    # Normalize to 0–255
    mel_norm = mel_db - mel_db.min()
    mel_norm = mel_norm / (mel_norm.max() + 1e-6)
    mel_norm = (mel_norm * 255).astype(np.uint8)

    # Convert to RGB image
    img = Image.fromarray(mel_norm)
    img = img.convert("RGB")
    img = img.resize((224, 224))

    return img

# =======================
# AUDIO PREPROCESSING
# =======================
def audio_to_tensor(file_bytes: bytes, sr: int = 22050) -> np.ndarray:
    y, sr = librosa.load(BytesIO(file_bytes), sr=sr)
    y, _ = librosa.effects.trim(y)
    y = librosa.util.normalize(y)

    mel = librosa.feature.melspectrogram(y=y, sr=sr)
    mel_db = librosa.power_to_db(mel, ref=np.max)

    img = mel_to_image(mel_db)

    img_array = np.array(img, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    return img_array

# =======================
# ROUTES
# =======================
@app.get("/")
def root():
    return {"message": "PureBreath backend is running"}

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    userId: str = Form(None)
):
    start_time = time.time()
    file_bytes = await file.read()

    # Audio duration
    try:
        y, sr = librosa.load(BytesIO(file_bytes), sr=None)
        duration = len(y) / sr
    except Exception:
        duration = None

    # Preprocess
    tensor = audio_to_tensor(file_bytes)

    # Predict
    model = get_model()
    preds = model.predict(tensor)
    pred_index = int(np.argmax(preds))
    confidence = float(np.max(preds))

    disease = CLASS_NAMES[pred_index]
    processing_time = int((time.time() - start_time) * 1000)

    # Optional DB save (only if configured)
    ANALYSIS_API_URL = os.getenv("ANALYSIS_API_URL")

    if userId and ANALYSIS_API_URL:
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

            requests.post(
                f"{ANALYSIS_API_URL}/api/analysis/save",
                json=analysis_data,
                timeout=5
            )
        except Exception as e:
            print(f"Analysis save failed: {e}")

    return {
        "prediction": disease,
        "confidence": round(confidence, 3)
    }
