import requests
import json

def test_post():
    url = "http://localhost:8888"

    test_data = {
        "image_urls": [
            "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741385997/amane_e00x7e.png",
            #"https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741636889/aman-ie_tyxx7x.jpg",
            #"https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741636889/amane-snowman_xnfvnk.jpg"
            "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741636416/nao-mori-small_lc2wpv.jpg",
            "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741636416/nao-bee-sm_aqsre2.jpg"
        ],
        "event_id": "3",
        "use_all_registered": True,
        #"face_ids": ["Amane", "Billy"],
        # "known_faces_urls": {
        #     "Naomi": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741386299/nao-mini_f5sp6z.jpg",
        #     "Elmer": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1731916167/qorws7mpkurpzdzlogs4.jpg",
        #     "Amane": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741385997/amane_e00x7e.png",
        #     "Billy": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741182571/Billie_Eilish_1_ngb1p5.jpg"
        # },
        "tolerance": 0.6
    }

    # ヘッダー
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    print("Sending POST request to:", url)
    print("Headers:", headers)
    print("Data:", json.dumps(test_data, indent=2))

    # POSTリクエスト送信
    response = requests.post(url, json=test_data, headers=headers)

    print("\nResponse:")
    print(f"Status Code: {response.status_code}")
    print("Headers:", dict(response.headers))
    try:
        print("Body:", json.dumps(response.json(), indent=2))
    except:
        print("Raw response:", response.text)

if __name__ == "__main__":
    test_post()
