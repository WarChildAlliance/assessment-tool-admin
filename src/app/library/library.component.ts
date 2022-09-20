import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TableFilter } from '../core/models/table-filter.model';
import { AssessmentService } from '../core/services/assessment.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  private filtersData = { subject: '', topic: '', subtopic: '', difficulty: '' };
  public tableFilters: TableFilter[];

  public difficultiesList = [
    {id: 1, name: 'Difficulty 1'},
    {id: 2, name: 'Difficulty 2'},
    {id: 3, name: 'Difficulty 3'}
  ];
  public subjectsList = ['PRESEL', 'POSTSEL', 'MATH', 'LITERACY'];
  public subtopicsList = ['Subtopic 1', 'Subtopic 2', 'Subtopic 3'];
  public topicsList: any[] = [];

  public assessments: any;

  constructor(
    private assessmentService: AssessmentService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.getAssessments();
    this.getTopics();
  }

  private getAssessments(params?: object): void {
    this.assessmentService.getAssessmentsList(params).subscribe(assessmentsList => {
      this.assessments = assessmentsList.filter(assessment => !assessment.archived);
    });
  }

  private getTopics(): void {
    this.assessmentService.getAssessmentTopicsList().subscribe(topics => {
      this.topicsList = topics.filter(
        topic => this.assessments.find(assessment => assessment.id === topic.assessment_id)
      );
      this.setUpFilters();
    });
  }

  public applySelectFilters(key: string | number, value: any): void {
    this.filtersData[key] = value;
    this.getAssessments(this.filtersData);
  }

  private setUpFilters(): void {
    this.tableFilters = [
      {
        key: 'subject',
        name: 'general.subject',
        type: 'select',
        options: [{ key: '', value: 'All' }].concat(this.subjectsList.map(item => ({ key: item, value: item })))
      },
      {
        key: 'topic',
        name: 'general.topics',
        type: 'select',
        options: [{ key: '', value: 'All' }].concat(this.topicsList.map(topic => ({ key: topic.id, value: topic.name })))
      },
      {
        key: 'subtopic',
        name: 'assessmentBuilder.topicFormDialog.subtopic',
        type: 'select',
        options: [{ key: '', value: 'All' }].concat(this.subtopicsList.map(item => ({ key: item, value: item })))
      },
      {
        key: 'difficulty',
        name: 'assessmentBuilder.questions.difficulty',
        type: 'select',
          options: [{ key: '', value: 'All' }].concat(this.difficultiesList.map(item => ({ key: item.id.toString(), value: item.name })))
        },
    ];
    this.tableFilters.forEach(filter => {
      this.translateService.stream(filter.name).subscribe(translated => filter.name = translated);
    });
  }
}
