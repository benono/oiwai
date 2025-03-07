import functions_framework
import json
import requests
import tempfile
import face_recognition
import os
import numpy as np
import cv2
import hashlib
import pickle

# ベースキャッシュディレクトリ
BASE_CACHE_DIR = os.environ.get('CACHE_DIR', 'face_cache')

# イベントごとの登録済み顔セット
EVENT_FACES = {
    "1": {
        "Naomi": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741386299/nao-mini_f5sp6z.jpg",
        "Elmer": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1731916167/qorws7mpkurpzdzlogs4.jpg"
    },
    "2": {
        "Amane": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741385997/amane_e00x7e.png",
        "Billy": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741182571/Billie_Eilish_1_ngb1p5.jpg"
    },
    "3": {
        "Naomi": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741386299/nao-mini_f5sp6z.jpg",
        "Elmer": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1731916167/qorws7mpkurpzdzlogs4.jpg",
        "Amane": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741385997/amane_e00x7e.png",
    },
    "default": {
        "Naomi": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741386299/nao-mini_f5sp6z.jpg",
        "Elmer": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1731916167/qorws7mpkurpzdzlogs4.jpg",
        "Amane": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741385997/amane_e00x7e.png",
        "Billy": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741182571/Billie_Eilish_1_ngb1p5.jpg"
    }
}

def get_event_cache_dir(event_id):
    """イベントIDに基づくキャッシュディレクトリを取得"""
    if not event_id:
        event_id = "default"
    
    event_cache_dir = os.path.join(BASE_CACHE_DIR, event_id)
    os.makedirs(event_cache_dir, exist_ok=True)
    return event_cache_dir

def get_cache_key(name, event_id=None):
    """イベントIDと名前に基づくキャッシュキーを生成"""
    if not event_id:
        event_id = "default"
    
    key_string = f"{event_id}:{name}"
    return hashlib.md5(key_string.encode()).hexdigest()

def load_encoding_from_cache(name, event_id=None):
    """イベントIDと名前に基づいてキャッシュからエンコーディングを読み込む"""
    cache_key = get_cache_key(name, event_id)
    cache_dir = get_event_cache_dir(event_id)
    cache_path = os.path.join(cache_dir, f"{cache_key}.pkl")
    
    if os.path.exists(cache_path):
        try:
            with open(cache_path, 'rb') as f:
                encoding = pickle.load(f)
            print(f"Loaded encoding from cache for {name} (event: {event_id or 'default'})")
            return encoding
        except Exception as e:
            print(f"Error loading from cache: {e}")
    
    return None

def save_encoding_to_cache(name, encoding, event_id=None):
    """イベントIDと名前に基づいてエンコーディングをキャッシュに保存"""
    cache_key = get_cache_key(name, event_id)
    cache_dir = get_event_cache_dir(event_id)
    cache_path = os.path.join(cache_dir, f"{cache_key}.pkl")
    try:
        with open(cache_path, 'wb') as f:
            pickle.dump(encoding, f)
        print(f"Saved encoding to cache for {name} (event: {event_id or 'default'})")
        return True
    except Exception as e:
        print(f"Error saving to cache: {e}")
        return False

def preprocess_image(img_path):
    """Preprocess the image"""
    try:
        # Load the image
        img = cv2.imread(img_path)
        if img is None:
            return None
            
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Adjust contrast
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        gray = clahe.apply(gray)
        
        # Remove noise
        denoised = cv2.fastNlMeansDenoising(gray)
        
        # Save as temporary file
        temp_path = img_path.replace('.jpg', '_processed.jpg')
        cv2.imwrite(temp_path, denoised)
        
        return temp_path
        
    except Exception as e:
        print(f"Error in preprocess_image: {str(e)}")
        return None

def download_image_from_url(url):
    """Download image from URL and save to temporary file"""
    try:
        # Download the image
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
        for chunk in response.iter_content(chunk_size=8192):
            temp_file.write(chunk)
        temp_file.close()
        
        return temp_file.name
    except Exception as e:
        print(f"Error downloading image from {url}: {str(e)}")
        return None

def load_known_faces(known_faces_urls=None, face_ids=None, event_id=None, use_cache=True):
    """イベントIDに基づいて既知の顔を読み込む"""
    known_encodings = {}
    
    # イベントIDに基づいて登録済み顔を取得
    event_faces = EVENT_FACES.get(event_id or "default", EVENT_FACES["default"])
    
    # face_idsオプションの処理
    if face_ids and not known_faces_urls:
        known_faces_urls = {}
        for face_id in face_ids:
            if face_id in event_faces:
                known_faces_urls[face_id] = event_faces[face_id]
    
    # 顔が指定されていない場合、イベントの全ての登録済み顔を使用
    if not known_faces_urls and not face_ids:
        known_faces_urls = event_faces
    
    # 各顔を処理
    for name, url in known_faces_urls.items():
        # まずキャッシュから読み込みを試みる
        if use_cache:
            encoding = load_encoding_from_cache(name, event_id)
            if encoding is not None:
                known_encodings[name] = encoding
                continue
        
        # キャッシュにない場合、ダウンロードして処理
        temp_path = download_image_from_url(url)
        if temp_path:
            try:
                img = face_recognition.load_image_file(temp_path)
                encodings = face_recognition.face_encodings(img)
                if encodings:
                    encoding = encodings[0]
                    known_encodings[name] = encoding
                    # 名前でキャッシュに保存
                    if use_cache:
                        save_encoding_to_cache(name, encoding, event_id)
                else:
                    print(f"Warning: No face found for {name}. Skipping.")
                os.unlink(temp_path)
            except Exception as e:
                print(f"Error processing known face {name}: {str(e)}")
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
    
    return known_encodings

def recognize_faces_from_urls(image_urls, known_encodings, tolerance=0.5):
    """Recognize faces from URL images using pre-loaded encodings"""
    results = []
    
    if not known_encodings:
        return json.dumps({"error": "No valid known faces provided"})
    
    for url in image_urls:
        temp_path = download_image_from_url(url)
        if not temp_path:
            results.append({"image": url, "error": "Failed to download image"})
            continue
        
        try:
            # Load and process image
            img = face_recognition.load_image_file(temp_path)
            face_encodings = face_recognition.face_encodings(img)
            face_locations = face_recognition.face_locations(img)
            
            if not face_encodings:
                results.append({"image": url, "name": "No face detected", "coordinates": None})
                os.unlink(temp_path)
                continue
            
            image_results = []
            
            for face_encoding, location in zip(face_encodings, face_locations):
                top, right, bottom, left = location
                x, y, width, height = left, top, right - left, bottom - top
                
                distances = face_recognition.face_distance(list(known_encodings.values()), face_encoding)
                best_match_index = np.argmin(distances) if len(distances) > 0 else None
                name = "Unknown"
                
                if best_match_index is not None and distances[best_match_index] < tolerance:
                    name = list(known_encodings.keys())[best_match_index]
                
                image_results.append({
                    "name": name,
                    "coordinates": {"x": x, "y": y, "width": width, "height": height}
                })
            
            results.append({"image": url, "faces": image_results})
            
            # Delete temporary file
            os.unlink(temp_path)
            
        except Exception as e:
            results.append({"image": url, "error": str(e)})
            if os.path.exists(temp_path):
                os.unlink(temp_path)
    
    return json.dumps(results, indent=4)

@functions_framework.http
def face_recognizer(request):
    # Set CORS headers
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    
    headers = {'Access-Control-Allow-Origin': '*'}
    # Process only POST requests
    if request.method != 'POST':
        return (json.dumps({'error': 'Only POST requests are accepted'}), 405, headers)
    print("request", request)

    """Simple test function that logs request details and returns a response"""
    print("Request received!")
    print(f"Method: {request.method}")
    print(f"Headers: {dict(request.headers)}")
    
    # Get request body and log output
    try:
        request_json = request.get_json(silent=True)
        print(f"Request body: {json.dumps(request_json, indent=2)}")
        if not request_json:
            return (json.dumps({'error': 'No JSON data provided'}), 400, headers)
        
        # Get parameters from request
        image_urls = request_json.get('image_urls', [])
        known_faces_urls = request_json.get('known_faces_urls', None)
        face_ids = request_json.get('face_ids', None)
        use_all_registered = request_json.get('use_all_registered', False)
        event_id = request_json.get('event_id', None)  # イベントIDを取得
        tolerance = request_json.get('tolerance', 0.5)
        use_cache = request_json.get('use_cache', True)
        
        if not image_urls:
            return (json.dumps({'error': 'No image_urls provided'}), 400, headers)
        
        # use_all_registeredがtrueの場合、イベントの全ての登録済み顔を使用
        if use_all_registered:
            known_faces_urls = None
            face_ids = None
        
        # 比較対象の顔が指定されていない場合、エラーを返す
        if not known_faces_urls and not face_ids and not use_all_registered:
            return (json.dumps({'error': 'No faces to compare against. Provide known_faces_urls, face_ids, or set use_all_registered to true'}), 400, headers)
        
        # イベントIDに基づいて既知の顔を読み込む
        known_encodings = load_known_faces(known_faces_urls, face_ids, event_id, use_cache)
        
        if not known_encodings:
            return (json.dumps({'error': 'No valid known faces loaded'}), 400, headers)
        
        # 顔認識を実行（known_encodingsを直接渡す）
        results = recognize_faces_from_urls(image_urls, known_encodings, tolerance)

        headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
        
        return (results, 200, headers)

    except Exception as e:
        print(f"Error parsing request body: {e}")
        return (json.dumps({'error': str(e)}), 500, headers)

    