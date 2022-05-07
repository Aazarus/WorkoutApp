import { ExerciseResult } from 'src/app/models/exerciseResult';
import { exercisesData } from './../../../data/exercises';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HistoryProgramExerciseComponent } from './history-program-exercise.component';

describe('HistoryProgramExerciseComponent', () => {
  let component: HistoryProgramExerciseComponent;
  let fixture: ComponentFixture<HistoryProgramExerciseComponent>;

  let mockExercise: ExerciseResult = { ...exercisesData[0], expectedReps: [] }
  

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryProgramExerciseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryProgramExerciseComponent);
    component = fixture.componentInstance;
    component.exercise = mockExercise;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {

    it("should create an empty array if exercise not available", () => {
      // Arrange
      var mockExerciseLocal: ExerciseResult = { ...exercisesData[0], expectedReps: [] }
      mockExerciseLocal.sets = 0;
      component.exercise = mockExerciseLocal;
      fixture.detectChanges();

      // Act
      component.ngOnInit();
      
      // Assert
      expect(component.sets).toEqual([]);
    });

    it(" should create an array with the numbers for a set", () => {
      // Arrange
      expect(mockExercise.sets).toBe(4);
      expect(component.sets).toEqual([0,1,2,3]);

      // Act
      component.ngOnInit();

      // Assert
      expect(component.sets).toEqual([0,1,2,3]);
    });
  });

  
  describe("getBodyPartTargeted", () => {
    it("should return arms,biceps for mock exercise", () => {
      // Arrange
      const expected = "Arms,Biceps";
      // Act
      const actual = component.getBodyPartTargeted();

      // Assert
      expect(actual).toBe(expected);
    });

    it("should return empty string if no body parts set", () => {
      // Arrange
      var mockExerciseLocal: ExerciseResult = { ...exercisesData[0], expectedReps: [] }
      mockExerciseLocal.bodyTargetArea = [];
      component.exercise = mockExerciseLocal;

      // Act
      const actual = component.getBodyPartTargeted();

      // Assert
      expect(actual).toBe('');
    });
  });
});
