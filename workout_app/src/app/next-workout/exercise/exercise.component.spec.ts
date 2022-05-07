import { Week } from './../../models/week';
import { exercisesData } from './../../data/exercises';
import { programData } from './../../data/program';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { ExerciseComponent } from './exercise.component';

describe('ExerciseComponent', () => {
  let component: ExerciseComponent;
  let fixture: ComponentFixture<ExerciseComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(waitForAsync(() => {
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['init', 'needsOnboarding', 'updateProgram']);
    
    TestBed.configureTestingModule({
      declarations: [ ExerciseComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: UserService, useValue: userServiceSpyObj },
      ]
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    
    fixture = TestBed.createComponent(ExerciseComponent);
    component = fixture.componentInstance;
    component.exercise = exercisesData[0];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should default sets to 0 if exercise does not have sets and call setupExercise', () => {

      // Arrange
      spyOn<any>(component, 'setupExercise');
      component.exercise = null;

      // Act
      component.ngOnInit();

      // Assert
      expect(component.sets).toEqual([0]);
      expect(component.setupExercise).toHaveBeenCalled();
    });

    it('should setup exercise if data is valid', () => {

      // Arrange
      spyOn<any>(component, 'setupExercise');

      // Act
      component.ngOnInit();

      // Assert
      expect(component.sets).toEqual([0,1,2,3]);
      expect(component.setupExercise).toHaveBeenCalled();
    });
  });

  describe('getReps', () => {

    it('should returns reps for set index', () => {
      // Arrange
      const expected = 'Reps: 20';

      // Act
      const actual = component.getReps(0);

      // Assert
      expect(actual).toBe(expected);
    });

    it('should return first reps for invalid index', () => {
      // Arrange
      const expected = 'Reps: 20';

      // Act
      const actual = component.getReps(-1);

      // Assert
      expect(actual).toBe(expected);
    });
  });

  describe('setupExercise', () => {

    it('should not perform setup if exercise is invalid', () => {
      // Arrange
    fixture = TestBed.createComponent(ExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

      // Act
      component.setupExercise();

      // Assert
      expect(component.exerciseResult).toBeNull();      
    });

    it('should perform setup if exercise is valid', () => {
      // Arrange
      // Act
      component.setupExercise();

      // Assert
      expect(component.exerciseResult).not.toBeNull();
      expect(component.exerciseResult.reps.length).toBe(component.exercise.sets)
      expect(component.exerciseResult.weight.length).toBe(component.exercise.sets)  
    });
  });

  describe('getBodyPartTargeted', () => {

    it('should correctly join body target areas', () => {
      // Arrange
      const expected = 'Arms,Biceps';
      // Act
      const actual = component.getBodyPartTargeted();

      // Assert
      expect(actual).toBe(expected);
    });

    it('should return empty string if body target areas not valid', () => {
      // Arrange
      const expected = '';
      fixture = TestBed.createComponent(ExerciseComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act
      const actual = component.getBodyPartTargeted();

      // Assert
      expect(actual).toBe(expected);
    });
  });

  describe('completedExercise', () => {

    it('should not process if isCompleted is true and should set isCompleted to false', () => {
      // Arrange
      component.isCompleted = true;
      spyOn<any>(component, 'setEmptyValues');
      fixture.detectChanges();

      // Act
      component.completedExercise();

      // Assert
      expect(component['setEmptyValues']).not.toHaveBeenCalled();
      expect(component.isCompleted).toBeFalsy();
    });

    it('should process if isCompleted is false and should set isCompleted to true', () => {
      // Arrange
      component.isCompleted = false;
      spyOn<any>(component, 'setEmptyValues');
      fixture.detectChanges();

      // Act
      component.completedExercise();

      // Assert
      expect(component['setEmptyValues']).toHaveBeenCalled();
      expect(component.isCompleted).toBeTruthy();
    });
  });
  
  describe('setEmptyValues', () => {

    it('should not set empty values if exerciseResult not valid', () => {
      // Arrange
      fixture = TestBed.createComponent(ExerciseComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      // Act
      component['setEmptyValues']();

      // Assert
      expect(component.exerciseResult).toBeNull();
    });

    it('should not set empty values if exerciseResult is empty', () => {
      // Arrange
      component.setupExercise();
      expect(component.exerciseResult).not.toBeNull();
      component.exerciseResult.sets = null;
      fixture.detectChanges();

      // Act
      component['setEmptyValues']();

      // Assert
      expect(component.exerciseResult.reps).toEqual([undefined, undefined, undefined, undefined]);
      expect(component.exerciseResult.weight).toEqual([undefined, undefined, undefined, undefined]);
    });

    it('should set empty values if any exerciseResult rep or weight is undefined', () => {
      // Arrange
      component.setupExercise();
      expect(component.exerciseResult).not.toBeNull();
      component.exerciseResult.reps = ['20', '20', undefined, '20'];
      component.exerciseResult.weight = ['20', undefined, '20', '20'];
      fixture.detectChanges();

      // Act
      component['setEmptyValues']();

      // Assert
      expect(component.exerciseResult.reps).toEqual(['20', '20', '0', '20']);
      expect(component.exerciseResult.weight).toEqual(['20', '0', '20', '20']);
    });
  });
});
