import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assessment } from '../models/assessment.model';
import { QuestionSet } from '../models/question-set.model';
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

  public deleteQuestionSet(assessmentId: string, questionSetId: string): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/assessments/${assessmentId}/question-sets/${questionSetId}/`);
  }

  public deleteQuestion(assessmentId: string, questionSetId: string, questionId: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.API_URL}/assessments/${assessmentId}/question-sets/${questionSetId}/questions/${questionId}/`
    );
  }

  public getAssessmentQuestionSets(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/assessments/${id}/question-sets/`);
  }

  public getAssessmentQuestionSetsList(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/question-sets/all/`);
  }

  public getAllQuestionsList(filteringParams?: object): Observable<any[]> {
    const initialUrl = `${environment.API_URL}/visualization/questions/all/`;
    const finalUrl = filteringParams ? this.utilitiesService.urlBuilder(initialUrl, filteringParams) : initialUrl;
    return this.http.get<any[]>(finalUrl);
  }

  public getQuestionsTypeList(questionType: string): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/assessments/questions/all/?type=${questionType}`);
  }

  public getQuestionSetQuestions(assessmentId: string, questionSetId: string, filteringParams?: object): Observable<any[]> {
    const initialUrl = `${environment.API_URL}/visualization/assessments/${assessmentId}/question-sets/${questionSetId}/questions/`;
    const finalUrl = filteringParams ? this.utilitiesService.urlBuilder(initialUrl, filteringParams) : initialUrl;
    return this.http.get<any[]>(finalUrl);
  }

  public createAssessment(assessment: FormData): Observable<Assessment> {
    return this.http.post<Assessment>(`${environment.API_URL}/assessments/`, assessment);
  }

  public editAssessment(assessmentId: string, assessment: any): Observable<Assessment> {
    return this.http.put<Assessment>(`${environment.API_URL}/assessments/${assessmentId}/`, assessment);
  }

  public createQuestionSet(id: string, questionSet: FormData): Observable<QuestionSet> {
    return this.http.post<QuestionSet>(`${environment.API_URL}/assessments/${id}/question-sets/`, questionSet);
  }

  public createQuestion(question: any, questionSetId: string, assessmentId: string): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}/assessments/${assessmentId}/question-sets/${questionSetId}/questions/`, question);
  }

  public editQuestionSet(assessmentId: string, questionSetId: string, questionSet: any): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}/assessments/${assessmentId}/question-sets/${questionSetId}/`, questionSet);
  }

  public reorderQuestionSets(assessmentId: string, data: any): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}/assessments/${assessmentId}/question-sets/reorder/`, data);
  }

  public editQuestion(assessmentId: string, questionSetId: string, questionId: string, question: any): Observable<any> {
    return this.http.put<any>(
      `${environment.API_URL}/assessments/${assessmentId}/question-sets/${questionSetId}/questions/${questionId}/`,
      question
    );
  }

  public reorderQuestions(assessmentId: string, questionSetId: string, data: any): Observable<any> {
    return this.http.put<any>(`${environment.API_URL}/assessments/${assessmentId}/question-sets/${questionSetId}/questions/reorder/`, data);
  }

  public getStudentAssessments(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/students_assessments/${studentId}/`);
  }

  public getQuestionsOverview(assessmentId: string, questionSetId: string, filteringParams?: object): Observable<any[]> {
    const initialUrl = `${environment.API_URL}/visualization/charts/assessments/${assessmentId}/question-sets/${questionSetId}/questions/`;
    const finalUrl = filteringParams ? this.utilitiesService.urlBuilder(initialUrl, filteringParams) : initialUrl;
    return this.http.get<any[]>(finalUrl);
  }

  public getQuestionDetails(assessmentId, questionSetId, questionId): Observable<any[]> {
    return this.http.get<any[]>(`
    ${environment.API_URL}/visualization/assessments/${assessmentId}/question-sets/${questionSetId}/questions/${questionId}/`
    );
  }

  public getAssessmentsListforDashboard(): Observable<AssessmentDashboard[]> {
    return this.http.get<AssessmentDashboard[]>(`${environment.API_URL}/visualization/charts/assessments/`);
  }

  public getQuestionSetsListForDashboard(assessmentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/charts/assessments/${assessmentId}/question-sets/`);
  }

  public getQuestionSetDetails(assessmentId: string, questionSetId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/assessments/${assessmentId}/question-sets/${questionSetId}`);
  }

  public getQuestionsList(assessmentId: string, questionSetId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/assessments/${assessmentId}/question-sets/${questionSetId}/questions`);
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

  public deleteAttachments(assessmentId: string, attachmentId: number): Observable<any[]> {
    return this.http.delete<any[]>(`${environment.API_URL}/assessments/${assessmentId}/attachments/${attachmentId}/`);
  }

  public getAllData(): Observable<any[]>  {
    return this.http.get<any[]>(`${environment.API_URL}/export/answers/`);
  }

  public downloadPDF(assessmentId: string, questionSetId?: string, questionId?: string): void {
    const url = `${environment.API_URL}/export/assessments/${assessmentId}/` + `${ questionSetId ? `question-sets/${questionSetId}/` : '' }`
     + `${ questionId ? `questions/${questionId}/` : '' }`;
    this.http.get(url, {
        responseType: 'blob', observe: 'response'
      }
    ).subscribe((data: HttpResponse<Blob>) => {
      this.openPDF(data);
    });
  }

  public addDraggableOption(assessmentId: string, questionSetId: string, questionId: string, data): Observable<any> {
    return this.http.post<any>(
      `${environment.API_URL}/assessments/${assessmentId}/question-sets/${questionSetId}/questions/${questionId}/draggable/`, data
    );
  }

  public getDraggableOptions(assessmentId: string, questionSetId: string, questionId: string): Observable<any> {
    return this.http.get<any>(
      `${environment.API_URL}/assessments/${assessmentId}/question-sets/${questionSetId}/questions/${questionId}/draggable/`
    );
  }

  public getTopics(subject: string = null): Observable<any> {
    const filteringParams = { subject };
    const initialUrl = `${environment.API_URL}/assessments/topics/`;
    const finalUrl = filteringParams ? this.utilitiesService.urlBuilder(initialUrl, filteringParams) : initialUrl;
    return this.http.get<any>(finalUrl);
  }

  public getLearningObjectives(filteringParams?: object): Observable<any> {
    const initialUrl = `${environment.API_URL}/assessments/learning-objectives/`;
    const finalUrl = filteringParams ? this.utilitiesService.urlBuilder(initialUrl, filteringParams) : initialUrl;
    return this.http.get<any>(finalUrl);
  }

  public getNumberRanges(grade: string = null): Observable<any> {
    const queryParams = grade ? `?grade=${grade}` : '';
    return this.http.get<any>(`${environment.API_URL}/assessments/number-ranges/${queryParams}`);
  }

  private openPDF(data: HttpResponse<Blob>): void {
    const filename = data.headers.get('Content-Disposition').match(/(?:filename=")(.*)(?:"{1})/)[1];
    const url = window.URL.createObjectURL(data.body);
    const w = window.open();
    w.document.write(
      `<html>
        <head>
          <title>${filename}</title>
        </head>
        <body style="margin: 0; padding: 0">
          <iframe src="${url}" style="width: 100%; height: 100%; margin: 0; padding: 0; border: none;"></iframe>
        </body>
      </html>`
    );
  }
}
