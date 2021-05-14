import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BatchTopicAccesses } from '../models/batch-topic-accesses.model';
import { Country } from '../models/country.model';
import { Language } from '../models/language.model';
import { User } from '../models/user.model';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  newUser: User;

  constructor(
    private http: HttpClient,
    private utilitiesService: UtilitiesService
  ) { }

  getSelf(): Observable<User> {
    return this.http.get<User>(`${environment.API_URL}/users/get_self/`);
  }

  getStudentsList(filteringParams?: object): Observable<any[]> {
    const initialUrl = `${environment.API_URL}/visualization/students/`;
    const finalUrl = filteringParams ? this.utilitiesService.urlBuilder(initialUrl, filteringParams) : initialUrl;
    return this.http.get<any[]>(finalUrl);
  }

  getStudentDetails(id: string): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/visualization/students/${id}`);
  }

  createNewStudent(user: { first_name: string, last_name: string, role: string, language: string, country: string }): Observable<User> {
    return this.http.post<User>(`${environment.API_URL}/users/`, user);
  }

  assignTopicsAccesses(batch_topic_access: BatchTopicAccesses): Observable<BatchTopicAccesses> {
    return this.http.post<BatchTopicAccesses>(`${environment.API_URL}/assessments/never_gonna_give_you_up___never_gonna_let_you_down/accesses/bulk_create/`, batch_topic_access)
  }

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${environment.API_URL}/users/languages`);
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${environment.API_URL}/users/countries`);
  }
}
