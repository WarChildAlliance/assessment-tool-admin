import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { AreaSelectorComponent } from '../area-selector/area-selector.component';

@Component({
  selector: 'app-question-drag-and-drop-form',
  templateUrl: './question-drag-and-drop-form.component.html',
  styleUrls: ['./question-drag-and-drop-form.component.scss']
})
export class QuestionDragAndDropFormComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private assessmentService: AssessmentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  public openDragAndDrop(): void {
    const dragAndDropComponent = this.dialog.open(AreaSelectorComponent);

    dragAndDropComponent.afterClosed().subscribe(value => {
      if (value) {
        console.log(value);
      }
    });
  }

}
