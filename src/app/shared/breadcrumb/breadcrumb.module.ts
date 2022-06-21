import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { CustomBreadcrumbComponent } from './breadcrumb.component';



@NgModule({
  declarations: [CustomBreadcrumbComponent],
  imports: [
    RouterModule,
    CommonModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    TranslateModule
  ],
  exports: [CustomBreadcrumbComponent]
})
export class CustomBreadcrumbModule { }

