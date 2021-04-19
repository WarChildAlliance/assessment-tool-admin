import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assessment } from '../models/assessment.model';
import { Question } from '../models/question.model';
import { Topic } from '../models/topic.models';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  // If at some point we need to programmatically get the current assessmentsList value,
  // we could change Subject to BehaviorSubject and destroy the subscriptions on
  // component's ngDestroy to avoid subscripting multiple times
  private assessmentsListSource: Subject<Assessment[]> = new Subject();
  private topicsListSource: Subject<Topic[]> = new Subject();
  private questionsListSource: Subject<Question[]> = new Subject();

  public assessmentsList = this.assessmentsListSource.asObservable();
  public topicsList = this.topicsListSource.asObservable();
  public questionsList = this.questionsListSource.asObservable();

  constructor(
    private http: HttpClient
  ) {}

  getAssessmentsList(): void {
    this.http.get<Assessment[]>(`${environment.API_URL}/assessments/`).subscribe(res => {
      this.assessmentsListSource.next(res);
    });
  }

  getAssessmentDetails(id: string): Observable<Assessment> {
    return this.http.get<Assessment>(`${environment.API_URL}/assessments/${id}/`);
  }

  getAssessmentTopics(id: string): void {
    this.http.get<Topic[]>(`${environment.API_URL}/assessments/${id}/topics/`).subscribe(res => {
      this.topicsListSource.next(res);
    });
  }

  getTopicQuestions(assessmentId: string, topicId: string): void {
    this.http.get<Question[]>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}/questions/`).subscribe(res => {
      this.questionsListSource.next(res);
    });
  }
}
