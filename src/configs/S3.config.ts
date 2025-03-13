import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { printError, success } from "../utils/logger";
import { randomUUID } from "crypto";

class BucketS3 {
  private config: S3Client | undefined;

  constructor() {
    try {
      const credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID?.toString() || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY?.toString() || "",
      };

      this.config = new S3Client({
        credentials: credentials,
        region: process.env.AWS_REGION?.toString(),
      });
      success("AWS S3 connection success");
    } catch (error) {
      printError("Error creating connection to AWS S3");
    }
  }

  /**
   * Sube una imagen de publicación a S3
   * @param file archivo a subir
   * @returns URL de la imagen subida o null si hay error
   */
  async uploadPublicationImage(
    file: Express.Multer.File
  ): Promise<string | null> {
    try {
      const uuid = randomUUID();
      const extension = file.originalname.split(".").pop();
      const fileName = `publications/${uuid}.${extension}`;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME?.toString(),
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(params);
      await (this.config ?? new S3Client()).send(command);

      const imageUrl = `${process.env.AWS_ENDPOINT}/${fileName}`;
      success("Publication image uploaded successfully to S3");
      return imageUrl;
    } catch (error) {
      printError("Error uploading publication image to S3: " + error);
      return null;
    }
  }

  /**
   * Elimina una imagen de publicación de S3
   * @param imageUrl URL de la imagen a eliminar
   */
  async deletePublicationImage(imageUrl: string): Promise<void> {
    try {
      const key = imageUrl.split("/").pop();
      if (!key) return;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME?.toString(),
        Key: `publications/${key}`,
      };

      const command = new DeleteObjectCommand(params);
      await (this.config ?? new S3Client()).send(command);
      success("Publication image deleted successfully from S3");
    } catch (error) {
      printError("Error deleting publication image from S3: " + error);
    }
  }
}

export default new BucketS3();
