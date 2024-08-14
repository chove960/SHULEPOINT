import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as bluebird from 'bluebird';

AWS.config.setPromisesDependency(bluebird);
AWS.config.update({
	region: process.env.AWS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

@Injectable()
export class ImageUploadService {
	async uploadSchoolLogo(schoolRegNumber: string, imageString: string): Promise<string> {
		const buf = Buffer.from(imageString.replace(/^data:image\/\w+;base64,/, ''), 'base64');

		const params = {
			Bucket: process.env.AWS_S3_BUCKET,
			Key: `schoolLogos/${schoolRegNumber}/Logo.png`,
			Body: buf,
			ACL: 'public-read',
			ContentEncoding: 'base64',
			ContentType: 'image/png',
		};

		return new Promise((resolve, reject) => {
			s3.upload(params, function (err, data) {
				if (err) {
					Logger.error(err.message);
					return reject(err);
				}
				return resolve(data.Location);
			});
		});
	}

	async uploadStudentPhoto(schoolRegNumber: string, studentID: string, imageString: string): Promise<string> {
		const buf = Buffer.from(imageString.replace(/^data:image\/\w+;base64,/, ''), 'base64');

		const params = {
			Bucket: process.env.AWS_S3_BUCKET,
			Key: `studentPhotos/${schoolRegNumber}/${studentID}/Photo.png`,
			Body: buf,
			ACL: 'public-read',
			ContentEncoding: 'base64',
			ContentType: 'image/png',
		};

		return new Promise((resolve, reject) => {
			s3.upload(params, function (err, data) {
				if (err) {
					Logger.error(err.message);
					return reject(err);
				}
				return resolve(data.Location);
			});
		});
	}
}
