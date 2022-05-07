import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProgressComponent } from './progress/progress.component';
import { ProgramSummaryComponent } from './program-summary/program-summary.component';

const components = [
    ProgressComponent,
    ProgramSummaryComponent
];

@NgModule({
    imports: [
        CommonModule,
        IonicModule
    ],
    declarations: components,
    exports: components,
})
export class SharedModule {}