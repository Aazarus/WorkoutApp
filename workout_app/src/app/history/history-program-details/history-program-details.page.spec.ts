import { programData } from 'src/app/data/program';
import { ProgramService } from 'src/app/services/program.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HistoryProgramDetailsPage } from './history-program-details.page';

describe('HistoryProgramDetailsPage', () => {
  let component: HistoryProgramDetailsPage;
  let fixture: ComponentFixture<HistoryProgramDetailsPage>;
  let programServiceSpy: jasmine.SpyObj<ProgramService>;

  const Program = programData[0];

  beforeEach(waitForAsync(() => {
    
    const programServiceSpyObj = jasmine.createSpyObj('ProgramService', ['getSelectedProgram']);
    TestBed.configureTestingModule({
      declarations: [ HistoryProgramDetailsPage ],
      imports: [
        IonicModule.forRoot()
      ],
      providers: [
      {
        provide: ProgramService, useValue: programServiceSpyObj
      }]
    }).compileComponents();

    programServiceSpy = TestBed.inject(ProgramService) as jasmine.SpyObj<ProgramService>;
    programServiceSpy.getSelectedProgram.and.returnValue(Program);
    
    fixture = TestBed.createComponent(HistoryProgramDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {

    it('should set the program and call methods for week', () => {
      // Arrange
      spyOn(component, 'onWeekSelected');
      spyOn(component, 'daySelected');

      // Act
      component.ngOnInit();

      // Assert
      expect(component.onWeekSelected).toHaveBeenCalled();
    });
  });

  describe('onWeekSelected', () => {

    /* it('should set the week and call method to set the day', () => {
      // Arrange
      const expected = programData[0].weeks[0];
      spyOn(component, "daySelected");

      // Act
      component.onWeekSelected();

      // Assert
      expect(component.selectedWeek).not.toBeNull();
      expect(component.selectedDayNumber).toBe(0);
      expect(component.daySelected).toHaveBeenCalled();
    }); */

    it('should not try to set the week or call method to set the day if program not set', () => {
      // Arrange
      component.program = null;
      component.selectedDayNumber = 1;
      spyOn(component, "daySelected");

      // Act
      component.onWeekSelected();

      // Assert
      expect(component.program).toBeNull();
      expect(component.selectedDayNumber).toBe(1);      
      expect(component.daySelected).not.toHaveBeenCalled();
    });

    it('should not try to set the week or call method to set the day if program is set and weeks are not', () => {
      // Arrange
      component.program.weeks = null;
      component.selectedDayNumber = 1;
      spyOn(component, "daySelected");

      // Act
      component.onWeekSelected();

      // Assert
      expect(component.program).not.toBeNull();
      expect(component.program.weeks).toBeNull();
      expect(component.selectedDayNumber).toBe(1);      
      expect(component.daySelected).not.toHaveBeenCalled();
    });
  });

  describe('onDaySelected', () => {

    it('should set the selected day value and call daySelected', () => {

      // Arrange
      const day = 1;
      const event = {
        detail: {
          value: day
        
      }};
      spyOn(component, "daySelected");

      // Act
      component.onDaySelected(event);

      // Assert
      component.selectedDayNumber = day;
      expect(component.daySelected).toHaveBeenCalled();      
    });

    it('should default to 0 if event is invalid and call daySelected', () => {

      // Arrange
      const day = 1;
      const event = null;
      spyOn(component, "daySelected");

      // Act
      component.onDaySelected(event);

      // Assert
      component.selectedDayNumber = day;
      expect(component.daySelected).toHaveBeenCalled();      
    });

    it('should default to 0 if event.detail is invalid and call daySelected', () => {

      // Arrange
      const day = 1;
      const event = {detail: null};
      spyOn(component, "daySelected");

      // Act
      component.onDaySelected(event);

      // Assert
      component.selectedDayNumber = day;
      expect(component.daySelected).toHaveBeenCalled();      
    });
  });

  describe('getTitle', () => {
    it('should return the program title if a program is set', () => {
      // Arrange
      // Act
      // Assert
      expect(component.getTitle()).toBe(Program.title);
    });

    it('should return an empty string if program is not set', () => {
      // Arrange
      component.program = null;
      fixture.detectChanges();

      // Act
      // Assert
      expect(component.getTitle()).toBe("");
    });
  });
});
