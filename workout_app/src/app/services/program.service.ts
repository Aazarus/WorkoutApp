import { programData } from './../data/program';
import { Injectable } from '@angular/core';
import { Exercise } from '../models/exercises';
import { exercisesData } from '../data/exercises';
import { Program } from '../models/program';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  
  private program: Program;

  constructor() { }

  public getExercise(id: number): Exercise {
    return exercisesData.find(ex => ex.id === id);
  }

  public getExercises(ids: number[]) {
    return ids.map<Exercise>(id => this.getExercise(id)).filter(ex => !!ex);
  }

  public getPrograms(): Program[] {
    return programData;
  }

  public getProgram(id: number): Program {
    return programData.find(p => p.id === id);
  }
  

  public setSelectedProgram(program: Program): void {
    this.program = program;
  }

  public getSelectedProgram(): Program {
    return this.program;
  }
}
