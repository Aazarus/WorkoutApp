import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { defaultOnBoarding, Onboarding } from 'src/app/models/onboarding';
import { ModalController } from '@ionic/angular';
import { UserData } from 'src/app/models/user.data';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators }   from '@angular/forms';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {

  userData: UserData;
  title: string;
  onboarding: Onboarding = defaultOnBoarding();

  ionicForm: FormGroup;
  isFormSubmitted: boolean = false;

  constructor(private modalController: ModalController,
    private userService: UserService,
    public formBuilder: FormBuilder,
    private settingsService: SettingsService) {
   }

   public ngOnInit(): void {
    this.title = environment.title;
    this.setupForm();
  }

  public dismiss(): void {
    this.modalController.dismiss();
  }

  public onNameChange(event: any): void {
    this.onboarding.name = event.detail.value;
  }

  public onDarkThemeChange(event): void {
    this.onboarding.isDarkTheme = event.detail.checked;
    this.settingsService.setTheme(this.onboarding.isDarkTheme); 
  }

  public async onboard(): Promise<void> {
    this.isFormSubmitted = true;

    if (this.ionicForm.valid) { 
      this.onboarding.name = this.ionicForm.get('name').value; 
      this.onboarding.isDarkTheme = this.ionicForm.get('darkTheme').value;
      this.onboarding.weight = this.ionicForm.get('weight').value;
      await this.userService.onboard(this.onboarding);
    }
    
    this.isFormSubmitted = false;
    this.dismiss();
  }  

  private setupForm(): void {
    this.ionicForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(15)]],
      darkTheme:[false],
      weight: ['KG', [Validators.required]]
    });
  }
}
