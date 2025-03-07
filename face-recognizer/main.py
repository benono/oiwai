import functions_framework
import json
import requests
import tempfile
import face_recognition
import os
import numpy as np
import cv2

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

def load_known_faces(known_faces_urls):
    """Load known face images from URLs and generate encodings"""
    known_encodings = {}
    
    for name, url in known_faces_urls.items():
        temp_path = download_image_from_url(url)
        print("temp_path", temp_path)
        if temp_path:
            try:
                img = face_recognition.load_image_file(temp_path)
                encodings = face_recognition.face_encodings(img)
                print("img", img)
                print("encodings", encodings)
                if encodings:
                    known_encodings[name] = encodings[0]
                else:
                    print(f"Warning: No face found in {url}. Skipping.")
                # Delete temporary file
                os.unlink(temp_path)
            except Exception as e:
                print(f"Error processing known face {name}: {str(e)}")
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
    
    return known_encodings

def recognize_faces_from_urls(image_urls, known_faces_urls, tolerance=0.5):
    """Recognize faces from URL images"""
    results = []
    
    # Load encodings of known faces
    known_encodings = load_known_faces(known_faces_urls)
    
    if not known_encodings:
        return json.dumps({"error": "No valid known faces provided"})
    
    for url in image_urls:
        temp_path = download_image_from_url(url)
        if not temp_path:
            results.append({"image": url, "error": "Failed to download image"})
            continue
        
        try:
            # preprocess
            processed_path = preprocess_image(temp_path)
            if not processed_path:
                results.append({"image": url, "error": "Failed to preprocess image"})
                os.unlink(temp_path)
                continue
            
            img = face_recognition.load_image_file(processed_path)
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
        known_faces_urls = request_json.get('known_faces_urls', {})
        tolerance = request_json.get('tolerance', 0.5)
        
        if not image_urls:
            return (json.dumps({'error': 'No image_urls provided'}), 400, headers)
        
        if not known_faces_urls:
            return (json.dumps({'error': 'No known_faces_urls provided'}), 400, headers)
        
        # Execute face recognition
        results = recognize_faces_from_urls(image_urls, known_faces_urls, tolerance)

        
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
        
        return (results, 200, headers)

    except Exception as e:
        print(f"Error parsing request body: {e}")
        request_json = None

    