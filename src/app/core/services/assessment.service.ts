import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assessment } from '../models/assessment.model';
import { Topic } from '../models/topic.models';
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

  deleteAssessment(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/assessments/${id}/`);
  }

  deleteTopic(assessmentId: string, topicId: string): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}`);
  }

  deleteQuestion(assessmentId: string, topicId: string, questionId: string): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}/questions/${questionId}`);
  }

  getAssessmentTopics(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/assessments/${id}/topics/`);
  }

  getTopicQuestions(assessmentId: string, topicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/assessments/${assessmentId}/topics/${topicId}/questions/`);
  }

  createAssessment(assessment: any): Observable<Assessment> {
    return this.http.post<Assessment>(`${environment.API_URL}/assessments/`, assessment);
  }

  editAssessment(assessmentId: string, assessment: any): Observable<Assessment> {
    return this.http.put<Assessment>(`${environment.API_URL}/assessments/${assessmentId}/`, assessment);
  }

  createTopic(topic: Topic, id: string): Observable<Topic> {
    return this.http.post<Topic>(`${environment.API_URL}/assessments/${id}/topics/`, topic);
  }

  createQuestion(question: any, topicId: string, assessmentId: string): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}/questions/`, question);
  }

  editTopic(assessmentId: string, topicId: string, topic: any): Observable<Assessment> {
    return this.http.put<any>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}/`, topic);
  }

  editQuestion(assessmentId: string,  topicId: string,  questionId: string, question: any): Observable<Assessment> {
    return this.http.put<any>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}/questions/${questionId}/`, question);
  }

  getStudentAssessments(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/students_assessments/${studentId}/`);
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

  getTopicDetails(assessmentId: string, topicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}`);
  }

  updateAssessmentsList(assessments: AssessmentDashboard[]): void {
    this.assessmentsListForDashboard.next(assessments);
  }

}
