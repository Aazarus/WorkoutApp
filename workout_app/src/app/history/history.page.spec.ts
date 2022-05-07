import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { HistoryPage } from './history.page';
import { RouterTestingModule } from '@angular/router/testing';

describe('HistoryPage', () => {
  let component: HistoryPage;
  let fixture: ComponentFixture<HistoryPage>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;

  beforeEach(waitForAsync(() => {
    const navCtrlSpyObj = jasmine.createSpyObj('NavController', ['navigateForward']);
    
    TestBed.configureTestingModule({
      declarations: [ HistoryPage ],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
      {
        provide: NavController, useValue: navCtrlSpyObj
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryPage);
    navCtrlSpy = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('programSelected', () => {

    it('should call navigateForward with specific url', () => {
      // Arrange
      const expectedUrl = '/tabs/history/history-program-details';

      // Act
      component.programSelected();

      // Assert
      expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith(expectedUrl);
    });
  });
});
