import requests
import json

def test_post():
    # Cloud FunctionsのトリガーURLに変更
    url = "https://face-recognizer-189967247128.us-west1.run.app"

    # 新しい形式のテストデータ
    test_data = {
        "pictures": [
            {
                "id": "image1",
                "image_url": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741385997/amane_e00x7e.png"
            },
            {
                "id": "image2",
                "image_url": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741636889/aman-ie_tyxx7x.jpg"
            },
            {
                "id": "image3",
                "image_url": "https://res.cloudinary.com/dh0ywk4cn/image/upload/v1741636889/amane-snowman_xnfvnk.jpg"
            }
        ],
        "event_id": "3",
        "use_all_registered": True,
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
