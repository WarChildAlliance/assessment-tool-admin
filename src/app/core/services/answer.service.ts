import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Answer } from '../models/answer.model';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private http: HttpClient,) { }

  getAssessmentTopicsAnwsers(studentId: string): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${environment.API_URL}/answers/${studentId}/topics/`);
  }
}
