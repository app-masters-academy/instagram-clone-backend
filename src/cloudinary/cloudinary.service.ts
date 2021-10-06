import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as sharp from 'sharp';

@Injectable()
export class CloudinaryService {
  uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (file.mimetype !== 'image/png') {
      throw new BadRequestException('File is not an image');
    }
    return new Promise(async (resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        console.log(error);
        if (error) return reject(error);
        resolve(result);
      });

      sharp(file.buffer).resize(1080).png({ quality: 80 }).pipe(upload);
    });
  }
}