import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  constructor(
    public userService: UserService,
    private navCtrl: NavController
  ) { }

  public ngOnInit(): void {
  }

  public programSelected(): void {
    this.navCtrl.navigateForward(`/tabs/history/history-program-details`);
  }
}
