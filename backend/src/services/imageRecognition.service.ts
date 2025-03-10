// No imports needed for fetch since it's built into Node.js

import { Picture } from "../types/picture";

interface FaceCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Face {
  name: string;
  coordinates: FaceCoordinates;
}

interface ImageRecognitionResponse {
  image: string;
  faces: Face[];
}

export class ImageRecognitionService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.IMAGE_RECOGNITION_API_URL!;
  }

  async getImageTags(request: {
    eventId: string;
    pictures: Picture[];
  }): Promise<ImageRecognitionResponse[]> {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: request.eventId,
          pictures: request.pictures.map((picture) => ({
            id: picture.id,
            image_url: picture.imageUrl,
          })),
          use_all_registered: true,
          tolerance: 0.6,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to get image tags:", error);
      throw error;
    }
  }
}
