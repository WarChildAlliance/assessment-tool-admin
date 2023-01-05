import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private readonly componentDataSource = new BehaviorSubject<any>(null);

  constructor() { }

  public get componentData(): Observable<any> {
    return this.componentDataSource.asObservable();
  }

  public set componentData(item: any) {
    this.componentDataSource.next(item);
  }
}
