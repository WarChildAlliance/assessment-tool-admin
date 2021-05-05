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

  getStudentAssessments(studentId: string): Observable<string> {
    return this.http.get<string>(`${environment.API_URL}/assessments/${studentId}/fetch_for_student/`)
  }

  getAssessmentTopicsAnwsers(studentId: string): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${environment.API_URL}/answers/${studentId}/topics/`);
  }

  getSessionsAnswers(studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/answers/${studentId}/sessions/`);
  }
}
