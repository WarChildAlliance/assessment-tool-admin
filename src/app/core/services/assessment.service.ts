import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assessment } from '../models/assessment.model';

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
}
