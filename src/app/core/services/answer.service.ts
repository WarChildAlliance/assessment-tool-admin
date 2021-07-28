import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssessmentTableData } from '../models/assessment-table-data.model';
import { QuestionTableData } from '../models/question-table-data.model';
import { TopicTableData } from '../models/topic-table-data.model';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private http: HttpClient) { }

  getAssessmentsAnswers(studentId: string): Observable<AssessmentTableData[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/student_answers/${studentId}/assessments/`);
  }

  getTopicsAnwsers(studentId: string, assessmentId: string): Observable<TopicTableData[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/student_answers/${studentId}/assessments/${assessmentId}/topics`);
  }

  getQuestionsAnwsers(studentId: string, assessmentId: string, topicId: string): Observable<QuestionTableData[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/student_answers/${studentId}/assessments/${assessmentId}/topics/${topicId}/questions`);
  }
}
