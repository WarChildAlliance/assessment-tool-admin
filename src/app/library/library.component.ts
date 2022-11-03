import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TableFilter } from '../core/models/table-filter.model';
import { AssessmentService } from '../core/services/assessment.service';
import { Subtopic } from '../core/models/question.model';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  public tableFilters: TableFilter[];
  public subjectsList = ['MATH', 'LITERACY'];
  public subtopicsList: Subtopic[] = [];
  public topicsList: any[] = [];

  public assessments: any;

  private filtersData = { subject: '', topic: '', subtopic: '' };

  constructor(
    private assessmentService: AssessmentService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.getAssessments();
    this.getTopics();
    this.getSubtopics();
  }

  public applySelectFilters(key: string | number, value: any): void {
    this.filtersData[key] = value;
    this.getAssessments(this.filtersData);
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

  private getSubtopics(): void {
    this.assessmentService.getSubtopics().subscribe(subtopics => {
      this.subtopicsList = subtopics;
      this.setUpFilters();
    });
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
        name: 'assessmentBuilder.subtopic',
        type: 'select',
        options: [{ key: '', value: 'All' }].concat(this.subtopicsList.map(
          subtopic => ({ key: subtopic.id.toString(), value: subtopic.name })))
      },
    ];
    this.tableFilters.forEach(filter => {
      this.translateService.stream(filter.name).subscribe(translated => filter.name = translated);
    });
  }
}
