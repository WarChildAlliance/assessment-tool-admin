import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  public urlBuilder(url: string, filteringParams: object): string {

    // This loop removes empty properties from the object
    for (const param of Object.keys(filteringParams)) {
      if (!filteringParams[param]) {
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
