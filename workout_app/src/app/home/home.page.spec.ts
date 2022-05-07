import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { HomePage } from './home.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { YoutubeService } from 'src/app/services/youtube.service';
import { ProgramService } from 'src/app/services/program.service';
import { of } from 'rxjs';
import { Video } from 'src/app/models/video';
import { ThumbnailType } from 'src/app/models/ThumbnailType';
import { Thumbnail } from 'src/app/models/Thumbnail';
import { programData } from 'src/app/data/program';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let youtubeServiceSpy: jasmine.SpyObj<YoutubeService>;
  let programServiceSpy: jasmine.SpyObj<ProgramService>;

  const mockVideoThumbnails: Thumbnail[] = [{
      id: 1,
      thumbnailUrl: 'http://thumbnail-high.com',
      thumbnailType: ThumbnailType.High,
      videoId: 'aTestId' 
    }];

  const mockVideos: Video[] = [{
    channelId: 'testChannel',
    description: 'A test description',
    id: 1,
    publishedAt: new Date(),
    thumbnail: [
      mockVideoThumbnails[0]
    ],
    title: 'A test title',
    videoId: 'aTestId'
  }, {
    channelId: 'testChannel2',
    description: 'A test description',
    id: 2,
    publishedAt: new Date(),
    thumbnail: [
      mockVideoThumbnails[0]
    ],
    title: 'A test title 2',
    videoId: 'aTestId2'
  }, {
    channelId: 'testChannel3',
    description: 'A test description',
    id: 3,
    publishedAt: new Date(),
    thumbnail: [
      mockVideoThumbnails[0]
    ],
    title: 'A test title 3',
    videoId: 'aTestId3'
  }];

  beforeEach(waitForAsync(() => {
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['init', 'needsOnboarding', 'updateProgram']);
    const modalControllerSpyObj = jasmine.createSpyObj('ModalController', ['create']);
    const toastControllerSpyObj = jasmine.createSpyObj('ToastController', ['create', 'then']);
    const youtubeServiceSpyObj = jasmine.createSpyObj('YoutubeService', ['getLatestVideos', 'getVideoUrlFromVideoId']);
    const programServiceSpyObj = jasmine.createSpyObj('ProgramService', ['onboard', 'getPrograms']);

    TestBed.configureTestingModule({
      declarations: [ 
        HomePage
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        IonicModule.forRoot()
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpyObj },
        { provide: ModalController, useValue: modalControllerSpyObj },
        { provide: ToastController, useValue: toastControllerSpyObj },
        { provide: YoutubeService, useValue: youtubeServiceSpyObj },
        { provide: ProgramService, useValue: programServiceSpyObj },
      ]
    });

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    modalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
    toastControllerSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    youtubeServiceSpy = TestBed.inject(YoutubeService) as jasmine.SpyObj<YoutubeService>;
    programServiceSpy = TestBed.inject(ProgramService) as jasmine.SpyObj<ProgramService>;
    
    youtubeServiceSpy.getLatestVideos.and.returnValue(of(mockVideos));

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    spyOn<any>(component, 'checkOnboarding');

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should setup component', () => {
      // Arrange      
      // Act      
      // Assert
      expect(userServiceSpy.init).toHaveBeenCalled();
      expect(youtubeServiceSpy.getLatestVideos).toHaveBeenCalled();
      expect(component['checkOnboarding']).toHaveBeenCalled();
      expect(component.loadingVideos).toBeFalsy();

      expect(component.videos).toEqual(mockVideos);

    });

    it('should not call getLatestVideos on youtubeService if youtubeService is not available', async () => {
      // Arrange
      component['youtubeService'] = null;

      // Act
      await component.ngOnInit();

      // Assert
      expect(userServiceSpy.init).toHaveBeenCalled();
      expect(component['checkOnboarding']).toHaveBeenCalled();
      expect(component.loadingVideos).toBeTruthy();
    });
  });

  describe('openVideo', () => {
    it('should get the videoUrl and open video', () => {

      // Arrange
      const testUrl = "http://test.com"
      spyOn(window, 'open').and.stub();      
      youtubeServiceSpy.getVideoUrlFromVideoId.and.returnValue(testUrl);

      // Act
      component.openVideo(mockVideos[0]);

      // Assert
      expect(window.open).toHaveBeenCalledWith(testUrl, '_blank');
    });

    it('should get display toast if videoUrl is invalid', () => {

      // Arrange
      const testUrl: string = null
      youtubeServiceSpy.getVideoUrlFromVideoId.and.returnValue(testUrl);
      toastControllerSpy.create.and.returnValue(Promise.resolve(null));

      // Act
      component.openVideo(mockVideos[0]);

      // Assert
      expect(toastControllerSpy.create).toHaveBeenCalled();
    });
  });

  describe('getThumbnail', () => {
    
    it('should return high resolution thumbnail if available', () => {

      // Arrange
      const expected = mockVideoThumbnails[0].thumbnailUrl;

      // Act
      const actual = component.getThumbnail(mockVideos[0]);

      // Assert
      expect(actual).toBe(expected);
    });

    it('should return medium resolution thumbnail if high resolution not available', () => {

      // Arrange
      const mockVideoThumbnail: Thumbnail = {
        id: 1,
        thumbnailUrl: 'http://thumbnail-medium.com',
        thumbnailType: ThumbnailType.Medium,
        videoId: 'aTestId' 
      };
      const video = {
        channelId: 'testChannel',
        description: 'A test description',
        id: 1,
        publishedAt: new Date(),
        thumbnail: [
          mockVideoThumbnail
        ],
        title: 'A test title',
        videoId: 'aTestId'
      };
      video.thumbnail = [mockVideoThumbnail];
      const expected = video.thumbnail[0].thumbnailUrl;

      // Act
      const actual = component.getThumbnail(video);

      // Assert
      expect(actual).toBe(expected);
    });

    it('should return default resolution thumbnail if high and medium resolution not available', () => {

      // Arrange
      const mockVideoThumbnail: Thumbnail = {
        id: 1,
        thumbnailUrl: 'http://thumbnail-default.com',
        thumbnailType: ThumbnailType.Default,
        videoId: 'aTestId' 
      };
      const video = {
        channelId: 'testChannel',
        description: 'A test description',
        id: 1,
        publishedAt: new Date(),
        thumbnail: [
          mockVideoThumbnail
        ],
        title: 'A test title',
        videoId: 'aTestId'
      };
      video.thumbnail = [mockVideoThumbnail];
      const expected = video.thumbnail[0].thumbnailUrl;

      // Act
      const actual = component.getThumbnail(video);

      // Assert
      expect(actual).toBe(expected);
    });
  });

  describe('setProgram', () => {
    it('should set the users program to first from program data', async () => {
      // Arrange
      programServiceSpy.getPrograms.and.returnValue(programData);
      const program = programData[0];

      // Act
      await component.setProgram();

      // Assert
      expect(userServiceSpy.updateProgram).toHaveBeenCalledWith(program);
      expect(component.hasCurrentProgram).toBeTruthy();
    });
  });

  describe('checkOnboarding', () => {

    it('should not process onboarding if onboarding not required', async () => {
      // Arrange
      // Act
      await component['checkOnboarding']();

      // Assert
      expect(modalControllerSpy.create).not.toHaveBeenCalled();
    });
    
    it('should process onboarding if onboarding required', async () => {
      // Arrange
      // Act
      // Assert
      // ToDO: Complete this test
    });
  });

  describe('previousVideo', () => {
    it('should set selectedVideo correctly when at 0', () => {
      // Arrange
      component.selectedVideo = 0

      // Act
      component.previousVideo();

      // Assert
      expect(component.selectedVideo).toBe(mockVideos.length - 1);
    });

    it('should set selectedVideo correctly when greater than 0', () => {
      // Arrange
      component.selectedVideo = mockVideos.length - 1

      // Act
      component.previousVideo();

      // Assert
      expect(component.selectedVideo).toBe(mockVideos.length - 2);
    });
  });

  describe('nextVideo', () => {
    it('should set selectedVideo correctly when at on last video', () => {
      // Arrange
      component.selectedVideo = mockVideos.length - 1

      // Act
      component.nextVideo();

      // Assert
      expect(component.selectedVideo).toBe(0);
    });

    it('should set selectedVideo correctly when less than last video', () => {
      // Arrange
      component.selectedVideo = 0

      // Act
      component.nextVideo();

      // Assert
      expect(component.selectedVideo).toBe(1);
    });
  });
});
