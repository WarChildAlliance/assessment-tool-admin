import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssessmentDashboard } from '../models/assessment-dashboard.model';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  private assessmentsListForDashboard = new Subject();

  constructor(
    private http: HttpClient,
    private utilitiesService: UtilitiesService
  ) {}

  get completeAssessmentsList(): Observable<any> {
    return this.assessmentsListForDashboard.asObservable();
  }

  getAssessmentsList(filteringParams?: object): Observable<any[]> {
    const initialUrl = `${environment.API_URL}/visualization/assessments/`;
    const finalUrl = filteringParams ? this.utilitiesService.urlBuilder(initialUrl, filteringParams) : initialUrl;
    return this.http.get<any[]>(finalUrl);
  }

  getAssessmentDetails(id: string): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/visualization/assessments/${id}/`);
  }

  getAssessmentTopics(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/assessments/${id}/topics/`);
  }

  getTopicQuestions(assessmentId: string, topicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/assessments/${assessmentId}/topics/${topicId}/questions/`);
  }

  getQuestionsOverview(assessmentId: string, topicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/charts/assessments/${assessmentId}/topics/${topicId}/questions/`);
  }

  getQuestionDetails(assessmentId, topicId, questionId): Observable<any[]>{
    return this.http.get<any[]>(`
    ${environment.API_URL}/visualization/assessments/${assessmentId}/topics/${topicId}/questions/${questionId}`
    );
  }

  getAssessmentsListforDashboard(): Observable<AssessmentDashboard[]> {
    return this.http.get<AssessmentDashboard[]>(`${environment.API_URL}/visualization/charts/assessments/`);
  }

  getTopicsListForDashboard(assessmentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/charts/assessments/${assessmentId}/topics/`);
  }

  updateAssessmentsList(assessments: AssessmentDashboard[]): void {
    this.assessmentsListForDashboard.next(assessments);
  }
}
