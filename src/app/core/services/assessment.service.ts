import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assessment } from '../models/assessment.model';
import { Question } from '../models/question.model';
import { Topic } from '../models/topic.models';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(
    private http: HttpClient
  ) {}

  getAssessmentsList(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${environment.API_URL}/assessments/`);
  }

  getAssessmentDetails(id: string): Observable<Assessment> {
    return this.http.get<Assessment>(`${environment.API_URL}/assessments/${id}/`);
  }

  getAssessmentTopics(id: string): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${environment.API_URL}/assessments/${id}/topics/`);
  }

  getTopicQuestions(assessmentId: string, topicId: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${environment.API_URL}/assessments/${assessmentId}/topics/${topicId}/questions/`);
  }
}
