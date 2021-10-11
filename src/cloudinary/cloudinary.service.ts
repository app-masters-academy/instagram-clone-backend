import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as sharp from 'sharp';

@Injectable()
export class CloudinaryService {
  uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (file.mimetype != 'image/png' && file.mimetype != 'image/jpeg') {
      throw new BadRequestException('File is not an image');
    }
    return new Promise(async (resolve, reject) => {
      const folder = process.env.CLOUDINARY_FOLDER_NAME;
      const upload = v2.uploader.upload_stream(
        { folder: folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      sharp(file.buffer).resize(1080).png({ quality: 80 }).pipe(upload);
    });
  }
}
