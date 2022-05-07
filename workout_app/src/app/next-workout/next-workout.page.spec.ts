import { exercisesData } from 'src/app/data/exercises';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NextWorkoutPage } from './next-workout.page';
import { UserService } from 'src/app/services/user.service';
import { ProgramService } from 'src/app/services/program.service';
import { ExerciseResult } from 'src/app/models/exerciseResult';
import { Week } from 'src/app/models/Week';
import { Exercise } from 'src/app/models/exercises';

describe('NextWorkoutPage', () => {
  let component: NextWorkoutPage;
  let fixture: ComponentFixture<NextWorkoutPage>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let programServiceSpy: jasmine.SpyObj<ProgramService>;

  beforeEach(waitForAsync(() => {
    let userServiceSpyObj = jasmine.createSpyObj('UserService', ['getNextWorkout', 'completeDay'], {'weight': 'lb'});
    let programServiceSpyObj = jasmine.createSpyObj('UserService', ['getExercises']);

    TestBed.configureTestingModule({
      declarations: [NextWorkoutPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: UserService, useValue: userServiceSpyObj },
        { provide: ProgramService, useValue: programServiceSpyObj }
      ]
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    programServiceSpy = TestBed.inject(ProgramService) as jasmine.SpyObj<ProgramService>;

    fixture = TestBed.createComponent(NextWorkoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('exerciseCompleted', () => {

    it('should not process exerciseResult if exerciseResult is invalid', () => {
      // Arrange
      const exerciseResult: ExerciseResult = null;

      // Act
      component.exerciseCompleted(exerciseResult);

      // Assert
      expect(component['completedExercises']).toEqual([]);
    });

    it('should process exerciseResult if exerciseResult is valid', () => {
      // Arrange
      const dataArray = ['20', '20', '20'];
      const notes = 'This is a test note';
      const exerciseResult: ExerciseResult = {
        id: 1,
        title: 'A Test ExerciseResult',
        reps: dataArray,
        expectedReps: [],
        sets: 3,
        bodyTargetArea: [],
        notes: notes,
        weight: dataArray
      };
      component.exerciseResults = [exerciseResult];

      // Act
      component.exerciseCompleted(exerciseResult);

      // Assert
      expect(component['completedExercises'].length).toBe(1);
      expect(component['completedExercises'][0]).toEqual(exerciseResult.id);
    });

  });

  describe('completeDay', () => {

    it('should call notifyUserTheyHaveNotFinished if they have not completed all exercises', async () => {
      // Arrange
      spyOn<any>(component, 'getRemainingExercises').and.callFake(() => {
        return [1, 2, 3];
      });
      spyOn<any>(component, 'notifyUserTheyHaveNotFinished').and.stub();
      spyOn<any>(component, 'allowDayToComplete').and.stub();

      // Act
      await component.completeDay();

      // Assert
      expect(component['notifyUserTheyHaveNotFinished']).toHaveBeenCalled();
      expect(component['allowDayToComplete']).not.toHaveBeenCalled();
    });

    it('should call allowDayToComplete if they have completed all exercises', async () => {
      // Arrange
      spyOn<any>(component, 'getRemainingExercises').and.callFake(() => {
        return [];
      });
      spyOn<any>(component, 'notifyUserTheyHaveNotFinished').and.stub();
      spyOn<any>(component, 'allowDayToComplete').and.stub();

      // Act
      await component.completeDay();

      // Assert
      expect(component['allowDayToComplete']).toHaveBeenCalled();
      expect(component['notifyUserTheyHaveNotFinished']).not.toHaveBeenCalled();
    });
  });

  describe('loadNextWorkout', () => {

    it('should get the next workout and set exercises and exerciseResults if all conditionals are valid', () => {
      // Arrange
      const title = 'Day #1';
      var week: Week = weeks[0];
      expect(week).not.toBeNull();
      userServiceSpy.getNextWorkout.and.callFake(() => {
        return {
          title: title,
          day: week.days[0]
        };
      });

      const nextWorkout: Exercise[] = [
        exercisesData[0],
        exercisesData[1],
        exercisesData[2],
        exercisesData[3],
        exercisesData[4],
        exercisesData[5],
        exercisesData[6],
        exercisesData[7],
      ];

      programServiceSpy.getExercises.and.callFake(() => {
        return nextWorkout;
      });

      // Act
      component.loadNextWorkout();

      // Assert
      expect(component['nextWorkout']).not.toBeNull();
      expect(component.exercises).not.toBeNull();
      expect(component.exercises.length).toBe(nextWorkout.length)
      expect(component.exerciseResults).not.toBeNull();
    });

    it('should get the next workout but not set exercises and exerciseResults if next workout result is invalid', () => {
      // Arrange
      const title = 'Day #1';
      var week: Week = weeks[0];
      expect(week).not.toBeNull();
      userServiceSpy.getNextWorkout.and.callFake(() => {
        return {
          title: title,
          day: null
        };
      });

      // Act
      component.loadNextWorkout();

      // Assert
      expect(component.title).toBe(title);
      expect(component['nextWorkout']).not.toBeNull();
      expect(component.exercises).toEqual([]);
      expect(component.exerciseResults).toEqual([]);
    });
  });

  describe('getRemainingExercises', () => {
    it('should return an empty array if there are no uncompleted exercises', () => {
      // Arrange
      const exercises = [
        exercisesData[0],
        exercisesData[1],
        exercisesData[2],
        exercisesData[3],
      ];
      component.exercises = exercises;
      exercises.forEach(ex => {
        component['completedExercises'].push(ex.id);
      });

      // Act
      const actual = component['getRemainingExercises']();

      // Assert
      expect(actual).toEqual([]);
    });

    it('should return collection of ids for exercises not complete if there are uncompleted exercises', () => {
      // Arrange
      const exercises = [
        exercisesData[0],
        exercisesData[1],
        exercisesData[2],
        exercisesData[3],
      ];
      component.exercises = exercises;
      var ids: number[] = [];
      exercises.forEach(ex => {
        ids.push(ex.id);
      });
      const expected = [ids.pop()];
      component['completedExercises'] = ids;

      // Act
      const actual = component['getRemainingExercises']();

      // Assert
      expect(actual).toEqual(expected);
    });
  });

  describe('allowDayToComplete', () => {
    it('should complete the day', () => {
      // Arrange
      var week: Week = weeks[0];
      expect(week).not.toBeNull();
      component.day = week.days[0];
      component.day.exercises.forEach((ex, index) => {
        component.exerciseResults.push({...exercisesData[index], expectedReps: exercisesData[index].reps})
      });

      expect(component.exerciseResults.length).toBe(8);

      // Act
      component['allowDayToComplete']();

      // Assert
      expect(component.isCompleted).toBeTruthy();
      expect(component.displayPostWorkout).toBeTruthy();
      expect(component.day.exerciseResults).toEqual(component.exerciseResults);
      expect(userServiceSpy.completeDay).toHaveBeenCalledWith(component.day);
      expect(component.displayCompletedProgram).toBeFalsy();
    });
  });

  describe('notifyUserTheyHaveNotFinished', () => {
    // ToDo: Add these tests.

  });

  describe('setEmptyValues', () => {
    it('should set any missed reps and weight to 0 and add the configured weight unit', () => {
      // Arrange
      const week: Week = weeks[0];
      var exerciseResults: ExerciseResult[] = [];
      var expectedExerciseResults: ExerciseResult[] = [];
      week.days[0].exercises.forEach((ex, index) => {
        exerciseResults.push({...exercisesData[index], expectedReps: exercisesData[index].reps, weight: []});
        expectedExerciseResults.push({...exercisesData[index], expectedReps: exercisesData[index].reps, weight: []});

        for(var i = 0; i < expectedExerciseResults[expectedExerciseResults.length - 1].sets; i++) {
          expectedExerciseResults[expectedExerciseResults.length - 1].weight[i] = '0 lb';          
        }
      });

      component.exerciseResults = exerciseResults;
      
      // Act
      component['setEmptyValues']();

      // Assert
      expect(component.exerciseResults).toEqual(expectedExerciseResults);
    });
  });
});

const weeks: Week[] = [
  {
      title: 'GIANT SETS',
      days: [
          {
              exercises: [ 1, 2, 3, 4, 5, 6, 7, 8 ],
              exerciseResults: [],
              completed: false,
              title: 'ARMS'
          },
          {
              exercises: [ 9, 10, 11, 12, 13, 14, 15, 16 ],
              exerciseResults: [],
              completed: false,
              title: 'SHOULDER + TRAP'
          },
          {
              exercises: [ 17, 18, 19, 20, 21, 22, 23, 24 ],
              exerciseResults: [],
              completed: false,
              title: 'BACK'
          },
          {
              exercises: [ 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 ],
              exerciseResults: [],
              completed: false,
              title: 'Chest + ABS'
          },
          {
              exercises: [ 35, 36, 37, 38, 39, 40, 41, 42, 43, 44 ],
              exerciseResults: [],
              completed: false,
              title: 'LEGS'
          },
      ],
      completed: false,
      startDate: null,
      endDate: null,
  },
  {
      title: 'DEATH BY VOLUME',
      days: [
          {
              title: 'ARMS',
              exercises: [45, 46, 47, 48, 49],
              exerciseResults: [],
              completed: false
          },
          {
              title: 'SHOULDERS',
              exercises: [50, 51, 52, 53],
              exerciseResults: [],
              completed: false
          },
          {
              title: 'BACK',
              exercises: [54, 55, 56, 57],
              exerciseResults: [],
              completed: false
          },
          {
              title: 'CHEST + ABS',
              exercises: [58, 59, 60, 61, 62],
              exerciseResults: [],
              completed: false
          },
          {
              title: 'LEGS',
              exercises: [63, 64, 65, 66, 67, 68],
              exerciseResults: [],
              completed: false
          },
      ],
      completed: false,
      startDate: null,
      endDate: null
  },
  {
      title: 'DROP SETS',
      days: [
          {
              title: 'ARMS',
              exercises: [69, 70, 71, 72, 73, 74],
              exerciseResults: [],
              completed: false
          },
          {
              title: 'SHOULDERS',
              exercises: [75, 76, 77, 78, 79],
              exerciseResults: [],
              completed: false
          },
          {
              title: 'BACK',
              exercises: [80, 81, 82, 83,],
              exerciseResults: [],
              completed: false
          },
          {
              title: 'CHEST + ABS',
              exercises: [84, 85, 86, 87, 88, 89],
              exerciseResults: [],
              completed: false
          },
          {
              title: 'LEGS',
              exercises: [90, 91, 92, 93, 94, 95],
              exerciseResults: [],
              completed: false
          },
      ],
      completed: false,
      startDate: null,
      endDate: null
  },
  {
      title: 'By Any Means Necessary',
      days: [
          {
              title: 'ARMS',
              exercises: [96, 97, 98, 99, 100, 101],
              exerciseResults: [],
              completed: false
          },
          {
              title: 'SHOULDERS',
              exercises: [102, 103, 104, 105, 106],
              exerciseResults: [],
              completed: false
          },
          {
              title: 'BACK + TRAPS',
              exercises: [107, 108, 109, 110, 111],
              exerciseResults: [],
              completed: false
          },
          {
              title: 'CHEST + ABS',
              exercises: [112, 113, 114, 115],
              exerciseResults: [],
              completed: false
          },
          {
              title: 'LEGS',
              exercises: [116, 117, 118, 119, 120],
              exerciseResults: [],
              completed: false
          },
      ],
      completed: false,
      startDate: null,
      endDate: null
  }
];