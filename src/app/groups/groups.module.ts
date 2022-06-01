import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '../shared/shared.module';
import { CustomButtonModule } from '../shared/button/button.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PreviousButtonModule } from '../shared/previous-button/previous-button.module';
import { GroupsComponent } from './groups.component';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupDialogModule } from './group-dialog/group-dialog.module';
import { GroupDetailComponent } from './group-detail/group-detail.component';

@NgModule({
  declarations: [
    GroupsComponent,
    GroupDetailComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    SharedModule,
    MatTabsModule,
    MatExpansionModule,
    CustomButtonModule,
    MatTooltipModule,
    PreviousButtonModule,
    GroupDialogModule
  ]
})
export class GroupsModule { }
