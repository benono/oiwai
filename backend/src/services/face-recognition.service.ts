import { PrismaClient } from "@prisma/client";
import { Picture } from "../types/picture";
import { ImageRecognitionService } from "./imageRecognition.service";

export class FaceRecognitionService {
  private prisma: PrismaClient;
  private imageRecognition: ImageRecognitionService;

  constructor() {
    this.prisma = new PrismaClient();
    this.imageRecognition = new ImageRecognitionService();
  }

  // 非同期で画像処理を実行するメソッド
  processImageTagsAsync(albumId: string, pictures: Picture[]): void {
    // 非同期処理を即座に開始し、結果を待たずに返す
    this.processImageTags(albumId, pictures)
      .then(() => {
        console.log(`Successfully processed tags for album ${albumId}`);
      })
      .catch((error) => {
        console.error(`Error processing tags for album ${albumId}:`, error);
      });
  }

  // 実際の処理を行うプライベートメソッド
  private async processImageTags(eventId: string, pictures: Picture[]) {
    try {
      // 各画像に対して並行して処理
      const request = {
        eventId,
        pictures,
      };

      const tags = await this.imageRecognition.getImageTags(request);
      console.log(JSON.stringify(tags));
      // Save face tags to DB
      await this.prisma.facePictures.createMany({
        data: tags.map((tag) => ({
          pictureId: Number(tag.id),
          tag: tag.faces[0].name,
        })),
      });
    } catch (error) {
      console.error("Error in tag processing:", error);
      // エラー監視システムへの通知などを追加可能
    }
  }
}
