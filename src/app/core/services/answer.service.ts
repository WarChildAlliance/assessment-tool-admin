import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssessmentTableData } from '../models/assessment-table-data.model';
import { QuestionTableData } from '../models/question-table-data.model';
import { SessionTableData } from '../models/session-table-data.model';
import { TopicTableData } from '../models/topic-table-data.model';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private http: HttpClient, private utilitiesService: UtilitiesService) { }

  getSessionsAnswers(studentId: string): Observable<SessionTableData[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/student_answers/${studentId}/sessions/`);
  }

  getAssessmentsAnswers(studentId: string, sessionId: string = null): Observable<AssessmentTableData[]> {
    const initialUrl = `${environment.API_URL}/visualization/student_answers/${studentId}/assessments/`;
    const finalUrl = sessionId ? this.utilitiesService.urlBuilder(initialUrl, { session: sessionId }) : initialUrl;
    return this.http.get<any[]>(finalUrl);
  }

  getTopicsAnwsers(studentId: string, assessmentId: string, sessionId: string): Observable<TopicTableData[]> {
    const initialUrl = `${environment.API_URL}/visualization/student_answers/${studentId}/assessments/${assessmentId}/topics`;
    const finalUrl = sessionId ? this.utilitiesService.urlBuilder(initialUrl, { session: sessionId }) : initialUrl;
    return this.http.get<any[]>(finalUrl);
  }

  getQuestionsAnwsers(studentId: string, assessmentId: string, topicId: string, sessionId: string): Observable<QuestionTableData[]> {
    const initialUrl = `${environment.API_URL}/visualization/student_answers/${studentId}/assessments/${assessmentId}/topics/${topicId}/questions`;
    const finalUrl = sessionId ? this.utilitiesService.urlBuilder(initialUrl, { session: sessionId }) : initialUrl;
    return this.http.get<any[]>(finalUrl);
  }
}
