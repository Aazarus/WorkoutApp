import { ThumbnailType } from './ThumbnailType';

export interface Thumbnail
{
    id: number;
    thumbnailUrl: string;
    thumbnailType: ThumbnailType;
    videoId: string;
}