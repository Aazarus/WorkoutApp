import { Thumbnail } from './Thumbnail';

export interface Video {
    channelId: string;
    description: string;
    id: number;
    publishedAt: Date;
    thumbnail: Thumbnail[];
    title: string;
    videoId: string;
}