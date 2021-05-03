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

      if (!iterable[i - 1]) {url += '?'; }

      url += iterable[i] + '=' + filteringParams[iterable[i]];

      if (iterable[i + 1]) {url += '&'; }
    }

    return url;
  }
}
