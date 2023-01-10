import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AssessmentService } from 'src/app/core/services/assessment.service';
import { UserService } from 'src/app/core/services/user.service';
import { AssessmentFormDialogComponent } from './assessment-form-dialog/assessment-form-dialog.component';
import { Language } from 'src/app/core/models/language.model';
import { Country } from 'src/app/core/models/country.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assessment-builder',
  templateUrl: './assessment-builder.component.html',
  styleUrls: ['./assessment-builder.component.scss']
})
export class AssessmentBuilderComponent implements OnInit {

  public currentAssessments: any[] = [];

  public languages: Language[];
  public countries: Country[];
  public subjects = ['MATH', 'LITERACY'];

  public icon: File = null;

  public edit = false;
  public type;
  public loading = true;

  public createNewAssessmentForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    grade: new FormControl(0, [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    icon: new FormControl('', [Validators.required]),
    private: new FormControl(false, [Validators.required])
  });

  constructor(
    private assessmentService: AssessmentService,
    private userService: UserService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe(params => {
      this.type = params.type;
    });
    this.getAssessments();
    this.userService.getLanguages().subscribe( res => this.languages = res);
    this.userService.getCountries().subscribe( res => this.countries = res);
  }

  public getAssessments(): void {
    this.loading = true;
    this.assessmentService.getAssessmentsList().subscribe((assessmentsList) => {
      this.currentAssessments = assessmentsList;
      this.loading = false;
    });
  }

  public openAssessmentFormDialog(): void {
    const createAssessmentDialog = this.dialog.open(AssessmentFormDialogComponent, {
      data: {
        edit: this.edit,
        assessmentsList: this.currentAssessments
      }
    });
    createAssessmentDialog.afterClosed().subscribe((value) => {
      if (value) {
        this.getAssessments();
      }
    });
  }
}
