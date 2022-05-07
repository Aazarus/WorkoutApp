import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private YOUTUBE_URI = 'https://www.youtube.com/watch?v=';
  
  private api_url: string;
  private END_POINT = 'Video';
  private API_VERSION = 'v1.0';
  private CHANNEL_ID = '';
  private MAX_RESULTS = '10';

  constructor(private http: HttpClient) {
    this.api_url = environment.youtubeService.url;
  }

  public getVideoUrlFromVideoId(videoId: string): string {
    return `${this.YOUTUBE_URI}${videoId}`;
  }

  public getLatestVideos(): Observable<Object> {
    const url = `${this.api_url}/${this.END_POINT}/${this.API_VERSION}?channel=${this.CHANNEL_ID}&maxResults=${this.MAX_RESULTS}`;
    return this.http.get(url);
  }
}
