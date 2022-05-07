import { ProgramService } from 'src/app/services/program.service';
import { ThumbnailType } from 'src/app/models/ThumbnailType';
import { YoutubeService } from 'src/app/services/youtube.service';
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import SwiperCore, { Autoplay, EffectFade, Keyboard, Pagination, Scrollbar, SwiperOptions, Zoom } from 'swiper';
import { Video } from 'src/app/models/video';
import { OnboardingComponent } from './onboarding/onboarding.component';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom, EffectFade]);

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  title: string;
  onboarded: boolean = false;
  hasCurrentProgram: boolean = false;

  loadingVideos: boolean;
  videos: Video[];
  selectedVideo: number = 0;

  swiperConfig: SwiperOptions = {
    slidesPerGroup: 10,
    pagination: { clickable: true },
    effect: "fade",
    autoplay:  {
      delay: 2500,
      disableOnInteraction: false,
    },
    loop: true,
    zoom: true,
    speed: 200
  };

  constructor(public userService: UserService,
    private modalController: ModalController,
    private toastController: ToastController,
    private youtubeService: YoutubeService,
    private programService: ProgramService) {
      this.title = environment.title;
  }

  public async ngOnInit(): Promise<void> {
    await this.userService.init();
    await this.checkOnboarding();
    this.loadingVideos = true;

    if (this.youtubeService) {
        this.youtubeService.getLatestVideos().subscribe((videos: Video[]) => {
        this.videos = videos;
        this.loadingVideos = false;
      });
    }
  }

  public openVideo(video: Video) {
    const videoUrl = this.youtubeService.getVideoUrlFromVideoId(video.videoId);
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    } else {
      this.toastController.create({
        message: `Problem opening Video ${video.title}.`,
        duration: 1500,
        position: "middle"
      })
      .then(toast => toast.present());
    }
  }

  public getThumbnail(video: Video): string {
    var thumbnail = video.thumbnail.find(t => t.thumbnailType === ThumbnailType.High);
    if (thumbnail) {
      return thumbnail.thumbnailUrl;
    }

    thumbnail = video.thumbnail.find(t => t.thumbnailType === ThumbnailType.Medium);
    if (thumbnail) {
      return thumbnail.thumbnailUrl;
    }

    thumbnail = video.thumbnail.find(t => t.thumbnailType === ThumbnailType.Default);
    if (thumbnail) {
      return thumbnail.thumbnailUrl;
    }
  }

  public async setProgram(): Promise<void> {
    const program = this.programService.getPrograms()[0];
    await this.userService.updateProgram(program);
    this.hasCurrentProgram = true;
  }

  private async checkOnboarding(): Promise<void> {
    if (this.userService.needsOnboarding) {
      const modal = await this.modalController.create({
        component: OnboardingComponent,
        breakpoints: [0, 0.3, 0.5, 0.6, 0.8],
        initialBreakpoint: 0.6,
        backdropDismiss: false
      });
      modal.onDidDismiss().then(() => {
        this.toastController.create({
          message: `You've registered. Welcome ${this.userService.username}`,
          duration: 1500,
          position: "middle"
        }).then(toast => toast.present())
        .then(() => {       
          this.onboarded = true;
        });
      });
      await modal.present();
    }
    this.onboarded = !this.userService.needsOnboarding;
  }

  public previousVideo(): void {
    if (this.selectedVideo === 0) {
      this.selectedVideo = this.videos.length - 1;
    } else {
      this.selectedVideo -= 1;
    }
  }

  public nextVideo(): void {
    if (this.selectedVideo === this.videos.length - 1) {
      this.selectedVideo = 0;
    } else {
      this.selectedVideo += 1;
    }
  }
}
