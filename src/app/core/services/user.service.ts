import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnswerDetails } from '../models/answer-details.model';
import { BatchQuestionSetAccesses } from '../models/batch-question-set-accesses.model';
import { Country } from '../models/country.model';
import { GroupTableData } from '../models/group-table-data.model';
import { Group } from '../models/group.model';
import { Language } from '../models/language.model';
import { StudentTableData } from '../models/student-table-data.model';
import { QuestionSetAccessStudents } from '../models/question-set-access-students.model';
import { QuestionSetAnswer } from '../models/question-set-answer.model';
import { User } from '../models/user.model';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private newUser: User;

  constructor(
    private http: HttpClient,
    private utilitiesService: UtilitiesService,
  ) { }

  public getSelf(): Observable<User> {
    return this.http.get<User>(`${environment.API_URL}/users/get_self/`);
  }

  public getStudentsList(filteringParams?: object): Observable<StudentTableData[]> {
    const initialUrl = `${environment.API_URL}/visualization/students/`;
    const finalUrl = filteringParams ? this.utilitiesService.urlBuilder(initialUrl, filteringParams) : initialUrl;
    return this.http.get<StudentTableData[]>(finalUrl);
  }

  public getStudentDetails(id: string): Observable<StudentTableData> {
    return this.http.get<StudentTableData>(`${environment.API_URL}/visualization/students/${id}`);
  }

  public createNewStudent(
    user: { first_name: string; last_name: string; role: string; language: string; country: string; group: string }
  ): Observable<User> {
    return this.http.post<User>(`${environment.API_URL}/users/`, user);
  }

  public editStudent(
    id: string,
    user: { first_name: string; last_name: string; role: string; language: string; country: string; group: string }
  ): Observable<User> {
    return this.http.put<User>(`${environment.API_URL}/users/${id}/`, user);
  }

  public deleteStudent(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/users/${id}/`);
  }

  public deleteStudents(ids: string[]): Observable<any> {
    const reqOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      body: {
        students: ids
      },
    };
    return this.http.delete<any>(`${environment.API_URL}/users/bulk_delete_students/`, reqOptions);
  }

  public assignQuestionSetsAccesses(questionSetsAccesses: BatchQuestionSetAccesses,
    assessmentId: string): Observable<BatchQuestionSetAccesses> {
    return this.http.post<BatchQuestionSetAccesses>(
      `${environment.API_URL}/assessments/${assessmentId}/accesses/bulk_create/`, questionSetsAccesses);
  }

  public removeQuestionSetAccess(assessmentId: string, questionSetAccessId: string): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/assessments/${assessmentId}/accesses/${questionSetAccessId}/`);
  }

  public getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${environment.API_URL}/users/languages`);
  }

  public getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${environment.API_URL}/users/countries`);
  }

  public getGroupsDetails(): Observable<GroupTableData[]> {
    return this.http.get<GroupTableData[]>(`${environment.API_URL}/visualization/groups/`);
  }

  public getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${environment.API_URL}/users/groups`);
  }

  public getGroupById(groupId: string): Observable<Group> {
    return this.http.get<Group>(`${environment.API_URL}/users/groups/${groupId}/`);
  }

  public createNewGroup(group: { name: string; supervisor: string }): Observable<Group> {
    return this.http.post<Group>(`${environment.API_URL}/users/groups/`, group);
  }

  public editGroup(groupId: string, group: { name: string; supervisor: string }): Observable<Group> {
    return this.http.put<Group>(`${environment.API_URL}/users/groups/${groupId}/`, group);
  }

  public deleteGroup(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/users/groups/${id}/`);
  }

  public deleteGroups(ids: string[]): Observable<any> {
    const reqOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      body: {
        groups: ids
      },
    };
    return this.http.delete<any>(`${environment.API_URL}/users/groups/bulk_delete/`, reqOptions);
  }

  public getStudentQuestionSetsChart(assessmentId: string):
  Observable<{full_name: string; question_sets: any[]; student_access: boolean; group: any[]}[]> {
    return this.http.get<{full_name: string; question_sets: any[]; student_access: boolean; group: Group[]}[]>(
      `${environment.API_URL}/visualization/charts/score_by_question_set/${assessmentId}/`
      );
  }

  public getGroupStudentsQuestionSetsChart(assessmentId: string, groupId: string): Observable<
    { full_name: string; questionSets: any[]; student_access: boolean; group: any[] }[] >
  {
    return this.http.get<{full_name: string; questionSets: any[]; student_access: boolean; group: any[]}[]>(
      `${environment.API_URL}/visualization/charts/score_by_question_set/${assessmentId}/group/${groupId}/`
    );
  }

  public getStudentsListForAQuestionSet(questionSetId: string, filteringParams?: object): Observable<QuestionSetAccessStudents[]> {
    const initialUrl = `${environment.API_URL}/visualization/charts/question-set/${questionSetId}/students/`;
    const finalUrl = filteringParams ? this.utilitiesService.urlBuilder(initialUrl, filteringParams) : initialUrl;
    return this.http.get<QuestionSetAccessStudents[]>(finalUrl);
  }

  public getStudentQuestionSetAnswers(questionSetId: string, assessmentQuestionSetAnswer: string): Observable<QuestionSetAnswer[]> {
    return this.http.get<QuestionSetAnswer[]>
    (`${environment.API_URL}/visualization/charts/question-set/${questionSetId}/student/${assessmentQuestionSetAnswer}/answers/`);
  }

  public getAnswerDetails(questionSetId: string, assessmentQuestionSetAnswer: string, answerId: string): Observable<AnswerDetails> {
    return this.http.get<AnswerDetails>(
      `${environment.API_URL}/visualization/charts/question-set/${questionSetId}/student/${assessmentQuestionSetAnswer}/answers/${answerId}`
    );
  }
}
