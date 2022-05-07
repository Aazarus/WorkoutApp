import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { OnboardingComponent } from './onboarding.component';
import { SettingsService } from 'src/app/services/settings.service';

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(waitForAsync(() => {
    const modalControllerSpyObj = jasmine.createSpyObj('ModalController', ['dismiss']);
    const settingsServiceSpyObj = jasmine.createSpyObj('SettingsService', ['setTheme']);
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['onboard']);

    TestBed.configureTestingModule({
      declarations: [ OnboardingComponent ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
      {
        provide: ModalController, useValue: modalControllerSpyObj
      },
      {
        provide: SettingsService, useValue: settingsServiceSpyObj
      },
      {
        provide: UserService, useValue: userServiceSpyObj
      }
    ]
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingComponent);
    modalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
    settingsServiceSpy = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set title and call setupForm', () => {
      // Arrange
      spyOn<any>(component, 'setupForm');
      
      // Act
      component.ngOnInit();

      // Assert
      expect(component.title).toBe(environment.title);
      expect(component['setupForm']).toHaveBeenCalled();
    });
  });

  describe('dismiss', () => {
    it('should call dismiss on the ModalController', () => {
      // Arrange
      // Act
      component.dismiss();

      // Assert
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
  
  describe('onNameChange', () => {

    it('should set onboarding name', () => {
      // Arrange
      const name = "Test"
      const event = {
        detail: {
          value: name
        
      }};

      // Act
      component.onNameChange(event);

      // Assert
      expect(component['onboarding']['name']).toBe(name);
    });
  });
  
  describe('onDarkThemeChange', () => {
    it('should set isDarkTheme and calls SettingsService', () => {
      // Arrange
      const checked = true
      const event = {
        detail: {
          checked: checked        
      }};

      // Act
      component.onDarkThemeChange(event);

      // Assert
      expect(component['onboarding']['isDarkTheme']).toBeTruthy();
      expect(settingsServiceSpy.setTheme).toHaveBeenCalledWith(checked);
    });
  });

  describe('onboard', () => {

    it('should not set onboarding or call userService if form is invalid', async () => {

      // Arrange
      spyOn(component, 'dismiss');

      // Act
      await component.onboard();

      // Assert
      expect(component['onboarding']['name']).toBe('');
      expect(component['onboarding']['isDarkTheme']).toBeFalsy();
      expect(component['onboarding']['weight']).toBe('KG');
      expect(component.dismiss).toHaveBeenCalled();
      expect(userServiceSpy.onboard).not.toHaveBeenCalled();
    });

    it('should set onboarding or call userService if form is valid', async () => {

      // Arrange
      spyOn(component, 'dismiss');
      component.ionicForm.controls.name.setValue('Test');
      component.ionicForm.controls.darkTheme.setValue(true);

      // Act
      await component.onboard();

      // Assert
      expect(component['onboarding']['name']).toBe('Test');
      expect(component['onboarding']['isDarkTheme']).toBeTruthy();
      expect(component['onboarding']['weight']).toBe('KG');
      expect(component.dismiss).toHaveBeenCalled();
      expect(userServiceSpy.onboard).toHaveBeenCalled();
    });
  });

  describe("setupForm", () => {

    it("should setup the form", () => {
      // Arrange
      component.ionicForm = null;
      expect(component.ionicForm).toBeNull();

      // Act
      component['setupForm']()

      // Assert
      expect(component.ionicForm).not.toBeNull();
      expect(component.ionicForm.controls.name.value).toBe('');
      expect(component.ionicForm.controls.darkTheme.value).toBeFalsy();
      expect(component.ionicForm.controls.weight.value).toBe('KG');
    });
  });
});
