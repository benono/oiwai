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
import time  # 時間計測用にtimeモジュールをインポート

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
    """イベントIDに基づいて既知の顔を読み込む（時間計測付き）"""
    total_start_time = time.time()  # 全体の処理開始時間
    known_encodings = {}
    cache_hits = 0
    cache_misses = 0
    
    print(f"[TIMING] Loading known faces for event: {event_id or 'default'}")
    
    # イベントIDに基づいて登録済み顔を取得
    event_faces = EVENT_FACES.get(event_id or "default", EVENT_FACES["default"])
    print(f"[TIMING] Found {len(event_faces)} registered faces for event")
    
    # face_idsオプションの処理
    if face_ids and not known_faces_urls:
        known_faces_urls = {}
        for face_id in face_ids:
            if face_id in event_faces:
                known_faces_urls[face_id] = event_faces[face_id]
        print(f"[TIMING] Selected {len(known_faces_urls)} faces from face_ids")
    
    # 顔が指定されていない場合、イベントの全ての登録済み顔を使用
    if not known_faces_urls and not face_ids:
        known_faces_urls = event_faces
        print(f"[TIMING] Using all {len(known_faces_urls)} registered faces for event")
    
    # 各顔を処理
    for name, url in known_faces_urls.items():
        face_start_time = time.time()  # 顔ごとの処理開始時間
        print(f"[TIMING] Processing known face: {name}")
        
        # まずキャッシュから読み込みを試みる
        if use_cache:
            cache_check_start = time.time()
            encoding = load_encoding_from_cache(name, event_id)
            cache_check_time = time.time() - cache_check_start
            
            if encoding is not None:
                known_encodings[name] = encoding
                cache_hits += 1
                face_time = time.time() - face_start_time
                print(f"[TIMING] Cache HIT for {name} (check: {cache_check_time:.3f}s, total: {face_time:.3f}s)")
                continue
            else:
                cache_misses += 1
                print(f"[TIMING] Cache MISS for {name} (check: {cache_check_time:.3f}s)")
        
        # キャッシュにない場合、ダウンロードして処理
        download_start = time.time()
        temp_path = download_image_from_url(url)
        download_time = time.time() - download_start
        print(f"[TIMING] Download took {download_time:.3f}s for {name}")
        
        if temp_path:
            try:
                # 画像読み込み時間の計測
                load_start = time.time()
                img = face_recognition.load_image_file(temp_path)
                load_time = time.time() - load_start
                print(f"[TIMING] Image loading took {load_time:.3f}s for {name}")
                
                # 顔エンコーディング時間の計測
                encoding_start = time.time()
                encodings = face_recognition.face_encodings(img)
                encoding_time = time.time() - encoding_start
                print(f"[TIMING] Face encoding took {encoding_time:.3f}s for {name}")
                
                if encodings:
                    encoding = encodings[0]
                    known_encodings[name] = encoding
                    
                    # キャッシュに保存
                    if use_cache:
                        cache_save_start = time.time()
                        save_encoding_to_cache(name, encoding, event_id)
                        cache_save_time = time.time() - cache_save_start
                        print(f"[TIMING] Cache save took {cache_save_time:.3f}s for {name}")
                else:
                    print(f"[TIMING] WARNING: No face found for {name}")
                
                # 一時ファイル削除
                os.unlink(temp_path)
            except Exception as e:
                print(f"[TIMING] Error processing {name}: {str(e)}")
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
        else:
            print(f"[TIMING] Failed to download image for {name}")
        
        face_time = time.time() - face_start_time
        print(f"[TIMING] Total processing for {name} took {face_time:.3f}s")
    
    total_time = time.time() - total_start_time
    print(f"[TIMING] Known faces loading complete:")
    print(f"[TIMING] - Total faces: {len(known_faces_urls)}")
    print(f"[TIMING] - Cache hits: {cache_hits}")
    print(f"[TIMING] - Cache misses: {cache_misses}")
    print(f"[TIMING] - Total time: {total_time:.3f}s")
    if len(known_faces_urls) > 0:
        print(f"[TIMING] - Average time per face: {total_time/len(known_faces_urls):.3f}s")
    
    return known_encodings

def recognize_faces_from_urls(image_urls, known_encodings, tolerance=0.5):
    """Recognize faces from URL images using pre-loaded encodings with timing logs"""
    results = []
    total_start_time = time.time()  # 全体の処理開始時間
    
    print(f"[TIMING] Starting face recognition for {len(image_urls)} images")
    
    if not known_encodings:
        print("[TIMING] No valid known faces provided, returning early")
        return json.dumps({"error": "No valid known faces provided"})
    
    for i, url in enumerate(image_urls):
        image_start_time = time.time()  # 画像ごとの処理開始時間
        print(f"[TIMING] Processing image {i+1}/{len(image_urls)}: {url}")
        
        # 画像ダウンロード時間の計測
        download_start_time = time.time()
        temp_path = download_image_from_url(url)
        download_time = time.time() - download_start_time
        print(f"[TIMING] Image download took {download_time:.3f} seconds")
        
        if not temp_path:
            results.append({"image": url, "error": "Failed to download image"})
            continue
        
        try:
            # 画像読み込み時間の計測
            load_start_time = time.time()
            img = face_recognition.load_image_file(temp_path)
            load_time = time.time() - load_start_time
            print(f"[TIMING] Image loading took {load_time:.3f} seconds")
            
            # 顔検出・エンコーディング時間の計測
            encoding_start_time = time.time()
            face_encodings = face_recognition.face_encodings(img)
            face_locations = face_recognition.face_locations(img)
            encoding_time = time.time() - encoding_start_time
            print(f"[TIMING] Face detection and encoding took {encoding_time:.3f} seconds")
            print(f"[TIMING] Found {len(face_encodings)} faces in image")
            
            if not face_encodings:
                results.append({"image": url, "name": "No face detected", "coordinates": None})
                os.unlink(temp_path)
                continue
            
            # 顔マッチング時間の計測
            matching_start_time = time.time()
            image_results = []
            
            for j, (face_encoding, location) in enumerate(zip(face_encodings, face_locations)):
                face_start_time = time.time()  # 個別の顔処理開始時間
                top, right, bottom, left = location
                x, y, width, height = left, top, right - left, bottom - top
                
                # 距離計算時間の計測
                distance_start_time = time.time()
                distances = face_recognition.face_distance(list(known_encodings.values()), face_encoding)
                distance_time = time.time() - distance_start_time
                print(f"[TIMING] Face distance calculation took {distance_time:.3f} seconds")
                
                best_match_index = np.argmin(distances) if len(distances) > 0 else None
                name = "Unknown"
                
                if best_match_index is not None and distances[best_match_index] < tolerance:
                    name = list(known_encodings.keys())[best_match_index]
                    match_distance = distances[best_match_index]
                    print(f"[TIMING] Face {j+1} matched with '{name}' (distance: {match_distance:.4f})")
                else:
                    if best_match_index is not None:
                        closest_name = list(known_encodings.keys())[best_match_index]
                        closest_distance = distances[best_match_index]
                        print(f"[TIMING] Face {j+1} no match. Closest was '{closest_name}' (distance: {closest_distance:.4f}, threshold: {tolerance})")
                    else:
                        print(f"[TIMING] Face {j+1} no match (no known faces to compare)")
                
                image_results.append({
                    "name": name,
                    "coordinates": {"x": x, "y": y, "width": width, "height": height}
                })
                
                face_time = time.time() - face_start_time
                print(f"[TIMING] Face {j+1} processing took {face_time:.3f} seconds")
            
            matching_time = time.time() - matching_start_time
            print(f"[TIMING] Face matching took {matching_time:.3f} seconds total")
            
            results.append({"image": url, "faces": image_results})
            
            # 一時ファイル削除
            os.unlink(temp_path)
            
            image_time = time.time() - image_start_time
            print(f"[TIMING] Total image {i+1} processing took {image_time:.3f} seconds")
            
        except Exception as e:
            print(f"[TIMING] Error processing image: {str(e)}")
            results.append({"image": url, "error": str(e)})
            if os.path.exists(temp_path):
                os.unlink(temp_path)
    
    total_time = time.time() - total_start_time
    print(f"[TIMING] Total face recognition processing took {total_time:.3f} seconds")
    print(f"[TIMING] Average time per image: {total_time/len(image_urls):.3f} seconds")
    
    return json.dumps(results, indent=4)

@functions_framework.http
def face_recognizer(request):
    request_start_time = time.time()  # リクエスト処理開始時間
    print(f"[TIMING] Request received at {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # CORS headers
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    
    headers = {'Access-Control-Allow-Origin': '*'}
    if request.method != 'POST':
        return (json.dumps({'error': 'Only POST requests are accepted'}), 405, headers)
    
    try:
        # リクエスト解析時間の計測
        parse_start_time = time.time()
        request_json = request.get_json(silent=True)
        parse_time = time.time() - parse_start_time
        print(f"[TIMING] Request parsing took {parse_time:.3f}s")
        
        if not request_json:
            return (json.dumps({'error': 'No JSON data provided'}), 400, headers)
        
        # パラメータ取得
        image_urls = request_json.get('image_urls', [])
        known_faces_urls = request_json.get('known_faces_urls', None)
        face_ids = request_json.get('face_ids', None)
        use_all_registered = request_json.get('use_all_registered', False)
        event_id = request_json.get('event_id', None)
        tolerance = request_json.get('tolerance', 0.5)
        use_cache = request_json.get('use_cache', True)
        
        print(f"[TIMING] Request parameters:")
        print(f"[TIMING] - Images: {len(image_urls)}")
        print(f"[TIMING] - Event ID: {event_id}")
        print(f"[TIMING] - Use all registered: {use_all_registered}")
        print(f"[TIMING] - Face IDs: {face_ids}")
        print(f"[TIMING] - Known faces URLs: {len(known_faces_urls) if known_faces_urls else 0}")
        print(f"[TIMING] - Tolerance: {tolerance}")
        print(f"[TIMING] - Use cache: {use_cache}")
        
        if not image_urls:
            return (json.dumps({'error': 'No image_urls provided'}), 400, headers)
        
        # use_all_registeredの処理
        if use_all_registered:
            known_faces_urls = None
            face_ids = None
        
        # 比較対象の顔が指定されていない場合、エラーを返す
        if not known_faces_urls and not face_ids and not use_all_registered:
            return (json.dumps({'error': 'No faces to compare against. Provide known_faces_urls, face_ids, or set use_all_registered to true'}), 400, headers)
        
        # 既知の顔を読み込む時間の計測
        known_faces_start_time = time.time()
        known_encodings = load_known_faces(known_faces_urls, face_ids, event_id, use_cache)
        known_faces_time = time.time() - known_faces_start_time
        print(f"[TIMING] Known faces loading took {known_faces_time:.3f}s")
        
        if not known_encodings:
            return (json.dumps({'error': 'No valid known faces loaded'}), 400, headers)
        
        # 顔認識実行時間の計測
        recognition_start_time = time.time()
        results = recognize_faces_from_urls(image_urls, known_encodings, tolerance)
        recognition_time = time.time() - recognition_start_time
        print(f"[TIMING] Face recognition took {recognition_time:.3f}s")
        
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
        
        total_time = time.time() - request_start_time
        print(f"[TIMING] Total request processing took {total_time:.3f}s")
        
        return (results, 200, headers)
    
    except Exception as e:
        error_time = time.time() - request_start_time
        print(f"[TIMING] Error after {error_time:.3f}s: {str(e)}")
        return (json.dumps({'error': str(e)}), 500, headers)

    