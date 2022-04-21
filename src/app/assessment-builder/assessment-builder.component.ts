import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/core/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-assessment-builder',
  templateUrl: './assessment-builder.component.html',
  styleUrls: ['./assessment-builder.component.scss']
})
export class AssessmentBuilderComponent implements OnInit {

  public currentAssessments: any[] = [];

  public languages;
  public countries;
  public subjects = ['PRESEL', 'POSTSEL', 'MATH', 'LITERACY'];

  public icon = null;

  public edit = false;

  public assessmentId: string;

  public createNewAssessmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    grade: new FormControl(0, [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    icon: new FormControl('', [Validators.required]),
    private: new FormControl(false, [Validators.required])
  });

  @ViewChild('createAssessmentDialog') createAssessmentDialog: TemplateRef<any>;

  constructor(
    private assessmentService: AssessmentService,
    private userService: UserService,
    private dialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.getAssessments();
    this.userService.getLanguages().subscribe( res => this.languages = res);
    this.userService.getCountries().subscribe( res => this.countries = res);
  }

  getAssessments(): void {
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      this.currentAssessments = assessmentsList;
    });
  }

  openCreateAssessmentDialog(): void {
    const createAssessmentDialog = this.dialog.open(this.createAssessmentDialog);
    createAssessmentDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getAssessments();
      }
    });
  }

  submitCreateNewAssessment(): void {
    if (this.edit) {
      this.assessmentService.editAssessment(this.assessmentId, this.createNewAssessmentForm.value).subscribe(() => {
        this.alertService.success('Assessment was altered successfully');
      } );
    } else {
      this.assessmentService.createAssessment(this.createNewAssessmentForm.value).subscribe(() => {
        this.alertService.success('Assessment was saved successfully');
      });
    }
    this.createNewAssessmentForm.reset();
  }

  handleFileInput(event): void {
    this.icon = event.target.files[0];
    this.createNewAssessmentForm.patchValue({
      icon: this.icon
    });
  }

}
