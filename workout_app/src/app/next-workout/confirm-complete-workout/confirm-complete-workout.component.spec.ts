import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, PopoverController } from '@ionic/angular';
import { ConfirmCompleteWorkoutComponent } from './confirm-complete-workout.component';


describe('ConfirmCompleteWorkoutComponent', () => {
  let component: ConfirmCompleteWorkoutComponent;
  let fixture: ComponentFixture<ConfirmCompleteWorkoutComponent>;
  let popoverControllerSpy: jasmine.SpyObj<PopoverController>;

  beforeEach(waitForAsync(() => {
    const popoverControllerSpyObj = jasmine.createSpyObj('PopoverController', ['dismiss']);

    TestBed.configureTestingModule({
      declarations: [ ConfirmCompleteWorkoutComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: PopoverController, useValue: popoverControllerSpyObj}
      ]
    }).compileComponents();

    popoverControllerSpy = TestBed.inject(PopoverController) as jasmine.SpyObj<PopoverController>;

    fixture = TestBed.createComponent(ConfirmCompleteWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('complete', () => {
    it('should call close passing true', () => {
      // Arrange
      spyOn<any>(component, 'close');
      fixture.detectChanges();

      // Act
      component.complete();

      // Assert
      expect(component['close']).toHaveBeenCalledWith(true);
    });
  });

  describe('cancel', () => {
    it('should call close passing false', () => {
      // Arrange
      spyOn<any>(component, 'close');
      fixture.detectChanges();

      // Act
      component.cancel();

      // Assert
      expect(component['close']).toHaveBeenCalledWith(false);
    });
  });

  describe('close', () => {
    it('should call dismiss on popoverController passing provided true value', () => {
      // Arrange      
      // Act
      component['close'](true);

      // Assert
      expect(popoverControllerSpy.dismiss).toHaveBeenCalledWith(true)
    });
    it('should call dismiss on popoverController passing provided false value', () => {
      // Arrange      
      // Act
      component['close'](false);

      // Assert
      expect(popoverControllerSpy.dismiss).toHaveBeenCalledWith(false)
    });
  });
});
