import { TestBed } from '@angular/core/testing';
import { exercisesData } from 'src/app/data/exercises';
import { programData } from 'src/app/data/program';
import { ProgramService } from './program.service';

describe('ProgramService', () => {
  let service: ProgramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getExercise', () => {

    it('should return the exercise for a given id', () => {
      // Arrange
      const exercise = exercisesData[0];

      // Act
      const actual = service.getExercise(exercise.id);

      // Assert
      expect(actual).toEqual(exercise);
    });
  });

  describe('getExercises', () => {

    it('should return the exercises for a given collection of ids', () => {
      // Arrange
      const exercise = [exercisesData[0], exercisesData[1], exercisesData[4],];

      // Act
      const actual = service.getExercises([
        exercise[0].id,
        exercise[1].id,
        exercise[2].id,
      ]);

      // Assert
      expect(actual).toEqual(exercise);
    });
  });

  describe('getPrograms', () => {

    it('should return the available Programs', () => {
      // Arrange
      const programs = programData;

      // Act
      const actual = service.getPrograms();

      // Assert
      expect(actual).toEqual(programs);
    });
  });

  describe('getProgram', () => {

    it('should return a Program for an Id', () => {
      // Arrange
      const program = programData[0];

      // Act
      const actual = service.getProgram(program.id);

      // Assert
      expect(actual).toEqual(program);
    });
  });

  describe('setSelectedProgram', () => {

    it('should set program using argument', () => {
      // Arrange
      const program = programData[0];
      service.setSelectedProgram(program);

      // Act
      const actual = service['program'];

      // Assert
      expect(actual).toEqual(program);
    });
  });

  describe('getSelectedProgram', () => {

    it('should get program current set', () => {
      // Arrange
      const program = programData[0];
      service.setSelectedProgram(program);

      // Act
      const actual = service.getSelectedProgram();

      // Assert
      expect(actual).toEqual(program);
    });
  });
});
