export interface AnnotatedAttachment {
  base64Content: string;
  fileName: string;
  fileType: string;
  fileDescription: string;
  status?: 'uploading' | 'complete';
}

export interface EditedImageObject {
  name: string;
  extension: string;
  mimeType: string;
  fullName?: string;
  height?: number;
  width?: number;
  imageBase64?: string;
  imageCanvas?: HTMLCanvasElement;
  quality?: number;
  cloudimageUrl?: string;
}
