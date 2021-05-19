import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assessment } from '../models/answers/assessment.model';
import { Question } from '../models/answers/question.model';
import { Session } from '../models/answers/session.model';
import { Topic } from '../models/answers/topic.model';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private http: HttpClient, private utilitiesService: UtilitiesService) { }

  getSessionsAnswers(studentId: string): Observable<Session[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/student_answers/${studentId}/sessions/`);
  }

  getAssessmentsAnswers(studentId: string, sessionId: string): Observable<Assessment[]> {
    const initialUrl = `${environment.API_URL}/visualization/student_answers/${studentId}/assessments/`;
    const finalUrl = sessionId ? this.utilitiesService.urlBuilder(initialUrl, {session: sessionId}) : initialUrl;
    return this.http.get<any[]>(finalUrl);
  }

  getTopicsAnwsers(studentId: string, assessmentId: string, sessionId: string): Observable<Topic[]> {
    const initialUrl = `${environment.API_URL}/visualization/student_answers/${studentId}/assessments/${assessmentId}/topics`;
    const finalUrl = sessionId ? this.utilitiesService.urlBuilder(initialUrl, {session: sessionId}) : initialUrl;
    return this.http.get<any[]>(finalUrl);
  }

  getQuestionsAnwsers(studentId: string, assessmentId: string, topicId: string, sessionId: string): Observable<Question[]> {
    const initialUrl = `${environment.API_URL}/visualization/student_answers/${studentId}/assessments/${assessmentId}/topics/${topicId}/questions`;
    const finalUrl = sessionId ? this.utilitiesService.urlBuilder(initialUrl, {session: sessionId}) : initialUrl;
    return this.http.get<any[]>(finalUrl);
  }
}
