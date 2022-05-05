import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  urlBuilder(url: string, filteringParams: object): string {

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

      url += iterable[i] + '=' + filteringParams[iterable[i]];

      if (iterable[i + 1]) { url += '&'; }
    }

    return url;
  }

  dateFormatter(date: Date): string {
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    const year = date.getFullYear().toString();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
  }
}
