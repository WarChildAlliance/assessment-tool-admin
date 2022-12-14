import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssessmentTableData } from '../models/assessment-table-data.model';
import { QuestionTableData } from '../models/question-table-data.model';
import { QuestionSetTableData } from '../models/question-set-table-data.model';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private http: HttpClient) { }

  public getAssessmentsAnswers(studentId: string): Observable<AssessmentTableData[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/student_answers/${studentId}/assessments/`);
  }

  public getAssessmentsAnswersDetails(studentId: string, assessmentId: string): Observable<AssessmentTableData> {
    return this.http.get<any>(`${environment.API_URL}/visualization/student_answers/${studentId}/assessments/${assessmentId}`);
  }

  public getQuestionSetsAnswers(studentId: string, assessmentId: string): Observable<QuestionSetTableData[]> {
    return this.http.get<any[]>(
      `${environment.API_URL}/visualization/student_answers/${studentId}/assessments/${assessmentId}question-sets`);
  }

  public getQuestionSetsAnswersDetails(studentId: string, assessmentId: string, questionSetId: string): Observable<QuestionSetTableData> {
    return this.http.get<any>
    (`${environment.API_URL}/visualization/student_answers/${studentId}/assessments/${assessmentId}question-sets/${questionSetId}`);
  }

  public getQuestionsAnwsers(studentId: string, assessmentId: string, questionSetId: string): Observable<QuestionTableData[]> {
    return this.http.get<any[]>(
      `${environment.API_URL}/visualization/student_answers/${studentId}/\
        assessments/${assessmentId}question-sets/${questionSetId}/questions`
    );
  }
}
