import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnswerDetails } from '../models/answer-details.model';
import { BatchTopicAccesses } from '../models/batch-topic-accesses.model';
import { Country } from '../models/country.model';
import { Group } from '../models/group.model';
import { Language } from '../models/language.model';
import { StudentTableData } from '../models/student-table-data.model';
import { TopicAccessStudents } from '../models/topic-access-students.model';
import { TopicAnswer } from '../models/topic-answer.model';
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
    user: { first_name: string, last_name: string, role: string, language: string, country: string, group: string }
  ): Observable<User> {
    return this.http.post<User>(`${environment.API_URL}/users/`, user);
  }

  public editStudent(
    id: string,
    user: { first_name: string, last_name: string, role: string, language: string, country: string, group: string }
  ): Observable<User> {
    return this.http.put<User>(`${environment.API_URL}/users/${id}/`, user);
  }

  public assignTopicsAccesses(batchTopicAccesses: BatchTopicAccesses, assessmentId: string): Observable<BatchTopicAccesses> {
    return this.http.post<BatchTopicAccesses>(
      `${environment.API_URL}/assessments/${assessmentId}/accesses/bulk_create/`, batchTopicAccesses);
  }

  public removeTopicAccess(assessmentId: string, topicAccessId: string): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}/assessments/${assessmentId}/accesses/${topicAccessId}/`);
  }

  public getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${environment.API_URL}/users/languages`);
  }

  public getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${environment.API_URL}/users/countries`);
  }

  public getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${environment.API_URL}/users/groups`);
  }

  public getGroupById(groupId: string): Observable<Group> {
    return this.http.get<Group>(`${environment.API_URL}/users/groups/${groupId}/`);
  }

  public createNewGroup(group: { name: string, supervisor: string }): Observable<Group> {
    return this.http.post<Group>(`${environment.API_URL}/users/groups/`, group);
  }

  public editGroup(groupId: string, group: { name: string, supervisor: string }): Observable<Group> {
    return this.http.put<Group>(`${environment.API_URL}/users/groups/${groupId}/`, group);
  }

  public getStudentTopicsChart(assessmentId: string):
  Observable<{full_name: string, topics: {}[], student_access: boolean, group: {}[]}[]> {
    return this.http.get<{full_name: string, topics: {}[], student_access: boolean, group: Group[]}[]>(
      `${environment.API_URL}/visualization/charts/score_by_topic/${assessmentId}/`
      );
  }

  public getGroupStudentsTopicsChart(assessmentId: string, groupId: string): Observable<
    { full_name: string, topics: {}[], student_access: boolean, group: {}[] }[] >
  {
    return this.http.get<{full_name: string, topics: {}[], student_access: boolean, group: {}[]}[]>(
      `${environment.API_URL}/visualization/charts/score_by_topic/${assessmentId}/group/${groupId}/`
    );
  }

  public getStudentsListForATopic(topicId: string, filteringParams?: object): Observable<TopicAccessStudents[]> {
    const initialUrl = `${environment.API_URL}/visualization/charts/topic/${topicId}/students/`;
    const finalUrl = filteringParams ? this.utilitiesService.urlBuilder(initialUrl, filteringParams) : initialUrl;
    return this.http.get<TopicAccessStudents[]>(finalUrl);
  }

  public getStudentTopicAnswers(topicId: string, assessmentTopicAnswer: string): Observable<TopicAnswer[]> {
    return this.http.get<TopicAnswer[]>(`${environment.API_URL}/visualization/charts/topic/${topicId}/student/${assessmentTopicAnswer}/answers/`);
  }

  public getAnswerDetails(topicId: string, assessmentTopicAnswer: string, answerId: string): Observable<AnswerDetails> {
    return this.http.get<AnswerDetails>(`${environment.API_URL}/visualization/charts/topic/${topicId}/student/${assessmentTopicAnswer}/answers/${answerId}`);
  }
}
