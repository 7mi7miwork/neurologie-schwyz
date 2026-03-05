import cv2
import os
import numpy as np   # <-- wichtig für np.array
from PIL import Image

# ----------------------------
# CONFIG
# ----------------------------
IMAGE_FOLDER = r"D:\Codes\Windsurf\neurologie-schwyz\images\team"
OUTPUT_WIDTH = 800
OUTPUT_HEIGHT = 534
WEBP_QUALITY = 80
HAAR_CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

face_cascade = cv2.CascadeClassifier(HAAR_CASCADE_PATH)
EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")

# ----------------------------
# FUNCTION: Crop face with margin and correct ratio
# ----------------------------
def crop_face(img_cv):
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4)

    h, w = img_cv.shape[:2]
    target_ratio = OUTPUT_WIDTH / OUTPUT_HEIGHT  # 800/534 ≈ 1.5

    if len(faces) == 0:
        # No face detected → center crop maintaining 1.5 ratio
        if w / h > target_ratio:
            new_w = int(h * target_ratio)
            left = (w - new_w) // 2
            return img_cv[:, left:left+new_w]
        else:
            new_h = int(w / target_ratio)
            top = (h - new_h) // 2
            return img_cv[top:top+new_h, :]

    # Pick the largest face
    x, y, fw, fh = max(faces, key=lambda rect: rect[2]*rect[3])

    # Add margin (~40%)
    margin_w = int(fw * 0.4)
    margin_h = int(fh * 0.4)
    left = max(x - margin_w, 0)
    top = max(y - margin_h, 0)
    right = min(x + fw + margin_w, w)
    bottom = min(y + fh + margin_h, h)

    cropped = img_cv[top:bottom, left:right]

    # Adjust crop to match target aspect ratio (1.5)
    ch, cw = cropped.shape[:2]
    current_ratio = cw / ch

    if current_ratio > target_ratio:
        # zu breit → zuschneiden
        new_cw = int(ch * target_ratio)
        left_crop = (cw - new_cw) // 2
        cropped = cropped[:, left_crop:left_crop+new_cw]
    else:
        # zu hoch → zuschneiden
        new_ch = int(cw / target_ratio)
        top_crop = (ch - new_ch) // 2
        cropped = cropped[top_crop:top_crop+new_ch, :]

    return cropped

# ----------------------------
# PROCESS IMAGES
# ----------------------------
for filename in os.listdir(IMAGE_FOLDER):
    if not filename.lower().endswith(EXTENSIONS):
        continue

    input_path = os.path.join(IMAGE_FOLDER, filename)
    name, _ = os.path.splitext(filename)
    output_path = os.path.join(IMAGE_FOLDER, f"{name}.webp")

    # Open image via PIL to support WebP
    img_pil = Image.open(input_path).convert("RGB")
    img_cv = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)

    cropped = crop_face(img_cv)
    cropped_resized = cv2.resize(cropped, (OUTPUT_WIDTH, OUTPUT_HEIGHT), interpolation=cv2.INTER_AREA)

    img_pil_out = Image.fromarray(cv2.cvtColor(cropped_resized, cv2.COLOR_BGR2RGB))
    img_pil_out.save(output_path, "WEBP", quality=WEBP_QUALITY)
    print(f"✅ Saved {output_path}")

print("🎉 All team WebP images processed and cropped to 800x534!")