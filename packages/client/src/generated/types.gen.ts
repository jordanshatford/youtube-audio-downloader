// This file is auto-generated by @hey-api/openapi-ts

export type AudioFormat = 'aac' | 'flac' | 'm4a' | 'mp3' | 'opus' | 'wav';

export const AudioFormat = {
	AAC: 'aac',
	FLAC: 'flac',
	M4A: 'm4a',
	MP3: 'mp3',
	OPUS: 'opus',
	WAV: 'wav'
} as const;

export type AvailableDownloadOptions = {
	format: Array<AudioFormat | VideoFormat>;
	quality: Array<DownloadQuality>;
	embed_metadata: Array<boolean>;
	embed_thumbnail: Array<boolean>;
	embed_subtitles: Array<boolean>;
};

export type Channel = {
	name: string;
	url: string;
	thumbnail: string;
};

export type Download = {
	video: Video;
	options: DownloadOptions;
	status: DownloadStatus;
};

export type DownloadInput = {
	video: Video;
	options: DownloadOptions;
};

export type DownloadOptions = {
	format: AudioFormat | VideoFormat;
	quality: DownloadQuality;
	embed_metadata: boolean;
	embed_thumbnail: boolean;
	embed_subtitles: boolean;
};

export type DownloadQuality = 'best' | 'worst';

export const DownloadQuality = {
	BEST: 'best',
	WORST: 'worst'
} as const;

export type DownloadState = 'WAITING' | 'DOWNLOADING' | 'PROCESSING' | 'DONE' | 'ERROR';

export const DownloadState = {
	WAITING: 'WAITING',
	DOWNLOADING: 'DOWNLOADING',
	PROCESSING: 'PROCESSING',
	DONE: 'DONE',
	ERROR: 'ERROR'
} as const;

export type DownloadStatus = {
	state: DownloadState;
	downloaded_bytes?: number | null;
	total_bytes?: number | null;
	elapsed?: number | null;
	eta?: number | null;
	speed?: number | null;
	postprocessor?: string | null;
	readonly progress: number | null;
};

export type HTTPValidationError = {
	detail?: Array<ValidationError>;
};

export type Session = {
	id: string;
};

export type ValidationError = {
	loc: Array<string | number>;
	msg: string;
	type: string;
};

export type Video = {
	id: string;
	url: string;
	title: string;
	duration: string;
	thumbnail: string;
	channel: Channel;
};

export type VideoFormat = 'avi' | 'flv' | 'mkv' | 'mov' | 'mp4' | 'webm';

export const VideoFormat = {
	AVI: 'avi',
	FLV: 'flv',
	MKV: 'mkv',
	MOV: 'mov',
	MP4: 'mp4',
	WEBM: 'webm'
} as const;

export type GetSearchData = {
	query: {
		query: string;
	};
};

export type GetSearchResponse = Array<Video>;

export type GetSearchError = unknown | HTTPValidationError;

export type GetNextSearchResponse = Array<Video>;

export type GetNextSearchError = unknown;

export type GetVideoData = {
	query: {
		id: string;
	};
};

export type GetVideoResponse = Video;

export type GetVideoError = unknown | HTTPValidationError;

export type GetSessionResponse = Session;

export type GetSessionError = unknown;

export type DeleteSessionResponse = void;

export type DeleteSessionError = unknown;

export type GetSessionValidateResponse = Session;

export type GetSessionValidateError = unknown;

export type GetDownloadsResponse = Array<Download>;

export type GetDownloadsError = unknown;

export type PutDownloadsData = {
	body: DownloadInput;
};

export type PutDownloadsResponse = Download;

export type PutDownloadsError = unknown | HTTPValidationError;

export type PostDownloadsData = {
	body: DownloadInput;
};

export type PostDownloadsResponse = Download;

export type PostDownloadsError = unknown | HTTPValidationError;

export type GetDownloadsOptionsResponse = AvailableDownloadOptions;

export type GetDownloadsOptionsError = unknown;

export type GetDownloadData = {
	path: {
		download_id: string;
	};
};

export type GetDownloadResponse = Download;

export type GetDownloadError = unknown | HTTPValidationError;

export type DeleteDownloadData = {
	path: {
		download_id: string;
	};
};

export type DeleteDownloadResponse = void;

export type DeleteDownloadError = unknown | HTTPValidationError;

export type GetDownloadFileData = {
	path: {
		download_id: string;
	};
};

export type GetDownloadFileResponse = Blob | File;

export type GetDownloadFileError = unknown | HTTPValidationError;
