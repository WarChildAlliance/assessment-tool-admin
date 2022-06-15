import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  ) { }

  public get completeAssessmentsList(): Observable<any> {
    return this.assessmentsListForDashboard.asObservable();
  }

  public getAssessmentsList(filteringParams?: object): Observable<any[]> {
    const initialUrl = `${environment.API_URL}/visualization/assessments/`;
    const finalUrl = filteringParams ? this.utilitiesService.urlBuilder(initialUrl, filteringParams) : initialUrl;
    return this.http.get<any[]>(finalUrl);
  }

  public getAssessmentDetails(id: string): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/visualization/assessments/${id}/`);
  }

  public deleteAssessment(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/assessments/${id}/`);
  }

  public deleteTopic(assessmentId: string, topicId: string): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}`);
  }

  public deleteQuestion(assessmentId: string, topicId: string, questionId: string): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}/questions/${questionId}`);
  }

  public getAssessmentTopics(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/assessments/${id}/topics/`);
  }

  public getTopicQuestions(assessmentId: string, topicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/assessments/${assessmentId}/topics/${topicId}/questions/`);
  }

  public createAssessment(assessment: FormData): Observable<Assessment> {
    return this.http.post<Assessment>(`${environment.API_URL}/assessments/`, assessment);
  }

  public editAssessment(assessmentId: string, assessment: any): Observable<Assessment> {
    return this.http.put<Assessment>(`${environment.API_URL}/assessments/${assessmentId}/`, assessment);
  }

  public createTopic(id: string, topic: FormData): Observable<Topic> {
    return this.http.post<Topic>(`${environment.API_URL}/assessments/${id}/topics/`, topic);
  }

  public createQuestion(question: any, topicId: string, assessmentId: string): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}/questions/`, question);
  }

  public editTopic(assessmentId: string, topicId: string, topic: any): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}/`, topic);
  }

  public editQuestion(assessmentId: string, topicId: string, questionId: string, question: any): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}/questions/${questionId}/`, question);
  }

  public getStudentAssessments(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/students_assessments/${studentId}/`);
  }

  public getQuestionsOverview(assessmentId: string, topicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/charts/assessments/${assessmentId}/topics/${topicId}/questions/`);
  }

  public getQuestionDetails(assessmentId, topicId, questionId): Observable<any[]> {
    return this.http.get<any[]>(`
    ${environment.API_URL}/visualization/assessments/${assessmentId}/topics/${topicId}/questions/${questionId}`
    );
  }

  public getAssessmentsListforDashboard(): Observable<AssessmentDashboard[]> {
    return this.http.get<AssessmentDashboard[]>(`${environment.API_URL}/visualization/charts/assessments/`);
  }

  public getTopicsListForDashboard(assessmentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/charts/assessments/${assessmentId}/topics/`);
  }

  public getTopicDetails(assessmentId: string, topicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}`);
  }

  public getQuestionsList(assessmentId: string, topicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}/questions`);
  }

  public updateAssessmentsList(assessments: AssessmentDashboard[]): void {
    this.assessmentsListForDashboard.next(assessments);
  }

  public getAttachmentsForAssessment(assessmentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/assessments/${assessmentId}/attachments/`);
  }

  public addAttachments(assessmentId: string, fileIn, attachmentType, destination, backgroundImage?: boolean): Observable<any[]> {
    const formData: FormData = new FormData();
    formData.append('file', fileIn);
    formData.append('attachment_type', attachmentType);
    formData.append(destination.name, destination.value);
    if (backgroundImage) {
      formData.append('background_image', destination.background_image);
    }
    return this.http.post<any[]>(`${environment.API_URL}/assessments/${assessmentId}/attachments/`, formData);
  }

  public updateAttachments(assessmentId: string, fileIn, attachmentType, attachmentId: number): Observable<any[]> {
    const formData: FormData = new FormData();
    formData.append('file', fileIn);
    formData.append('attachment_type', attachmentType);
    return this.http.put<any[]>(`${environment.API_URL}/assessments/${assessmentId}/attachments/${attachmentId}/`, formData);
  }

  public getAllData(): Observable<any[]>  {
    return this.http.get<any[]>(`${environment.API_URL}/export/answers/`);
  }

  public addDraggableOption(assessmentId: string, topicId: string, questionId: string, data): Observable<any> {
    return this.http.post<any>(
      `${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}/questions/${questionId}/draggable/`, data
    );
  }

  public getDraggableOptions(assessmentId: string, topicId: string, questionId: string): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}/questions/${questionId}/draggable/`);
  }
}
