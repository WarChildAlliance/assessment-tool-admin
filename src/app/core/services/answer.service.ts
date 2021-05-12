import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Answer } from '../models/answer.model';
import { Assessment } from '../models/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private http: HttpClient,) { }

  getStudentAssessments(studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/student_answers/${studentId}/assessments/`)
  }

  getAssessmentTopicsAnwsers(studentId: string, assessmentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/student_answers/${studentId}/assessments/${assessmentId}/topics`);
  }

  getQuestionsAnwsers(studentId: string, assessmentId: string, topicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/student_answers/${studentId}/assessments/${assessmentId}/topics/${topicId}/questions`);
  }

  getSessionsAnswers(studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/student_answers/${studentId}/sessions/`);
  }
}
