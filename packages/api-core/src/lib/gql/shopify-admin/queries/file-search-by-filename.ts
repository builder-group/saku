import { AppError } from '@repo/hono-utils';
import { Err, Ok, type TResult } from 'tuple-result';
import { getFiles } from './file-files';

export async function searchFileByFilename(
	filename: string,
	config: TSearchFileByFilenameConfig
): Promise<TResult<TSearchFileByFilenameSuccess, AppError>> {
	const result = await getFiles(
		{
			first: 1,
			query: { fileName: filename }
		},
		config
	);
	if (result.isErr()) {
		return Err(result.error);
	}

	const file = result.value.files[0];
	if (file == null) {
		return Err(
			new AppError('#ERR_FILE_NOT_FOUND', 404, {
				detail: `File not found: ${filename}`
			})
		);
	}

	return Ok(file);
}

interface TSearchFileByFilenameConfig {
	shopId: string;
	accessToken: string;
}

export interface TSearchFileByFilenameSuccess {
	id: string;
	alt: string;
	createdAt: string;
	fileName: string;
	previewImage?: {
		id: string;
		url: string;
	};
	url: string;
	details: TFileDetails;
}

type TFileDetails =
	| {
			type: 'image';
			id?: string;
			width?: number;
			height?: number;
			mimeType?: string;
	  }
	| {
			type: 'video';
			width: number;
			height: number;
			format: string;
	  }
	| {
			type: 'file';
			mimeType?: string;
	  };
