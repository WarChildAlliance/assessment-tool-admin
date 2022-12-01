import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  public urlBuilder(url: string, filteringParams: object): string {

    // This loop removes empty properties from the object
    for (const param of Object.keys(filteringParams)) {
      if (!filteringParams[param] || (Array.isArray(filteringParams[param]) && filteringParams[param].length === 0)) {
        delete filteringParams[param];
      }
    }

    const iterable = Object.keys(filteringParams);

    // This loop builds the url with the parameters
    for (let i = 0; i < iterable.length; i++) {

      if (!iterable[i - 1]) { url += '?'; }

      if (Array.isArray(filteringParams[iterable[i]])) {
        url += this.arrayToQueryString(iterable[i], filteringParams[iterable[i]]);
      } else {
        url += iterable[i] + '=' + filteringParams[iterable[i]];
      }

      if (iterable[i + 1]) { url += '&'; }
    }

    return url;
  }

  public dateFormatter(date: Date): string {
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    const year = date.getFullYear().toString();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
  }

  // To fix Mixed content and use only  HTTPS connection (if localhost, uses http path)
  public getSource(path: string): string {
    return (path.slice(0, 5) === 'http:')
      ? (path.includes('localhost') ? path : path.substring(0, 4) + 's' + path.substring(4))
      : environment.API_URL + path;
  }

  // this method unwraps an array into a query string
  private arrayToQueryString(key: string, arr: any[]): string {
    let queryString = '';
    for (let i = 0; i < arr.length; i++) {
      queryString += (i === 0) ?
        `${key}[]=${arr[i]}` : `&${key}[]=${arr[i]}`;
    }
    return queryString;
  }
}
