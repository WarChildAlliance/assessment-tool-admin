import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assessment } from '../models/assessment.model';
import { Topic } from '../models/topic.models';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(
    private http: HttpClient,
    private utilitiesService: UtilitiesService
  ) {}

  getAssessmentsList(filteringParams?: object): Observable<any[]> {
    const initialUrl = `${environment.API_URL}/visualization/assessments/`;
    const finalUrl = filteringParams ? this.utilitiesService.urlBuilder(initialUrl, filteringParams) : initialUrl;
    return this.http.get<any[]>(finalUrl);
  }

  getAssessmentDetails(id: string): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/visualization/assessments/${id}/`);
  }

  getAssessmentTopics(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/assessments/${id}/topics/`);
  }

  getTopicQuestions(assessmentId: string, topicId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.API_URL}/visualization/assessments/${assessmentId}/topics/${topicId}/questions/`);
  }

  createAssessment(assessment: any): Observable<Assessment> {
    return this.http.post<Assessment>(`${environment.API_URL}/assessments/`, assessment);
  }

  createTopic(topic: Topic, id: string): Observable<Topic> {
    return this.http.post<Topic>(`${environment.API_URL}/assessments/${id}/topics/`, topic);
  }
}
