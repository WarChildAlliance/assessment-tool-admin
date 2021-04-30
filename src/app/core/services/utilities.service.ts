import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  urlBuilder(url: string, filteringOptions: object): string {

    // This loop removes empty properties from the object
    // for (let i = 0; i < Object.keys(filteringOptions).length; i++) {

    //   const param = Object.keys(filteringOptions)[i];

    //   if (!filteringOptions[param]) {
    //     delete filteringOptions[param];
    //   }
    // }

    for (const param of Object.keys(filteringOptions)) {
      if (!filteringOptions[param]) {
        delete filteringOptions[param];
      }
    }

    const iterable = Object.keys(filteringOptions);

    // This loop builds the url with the parameters
    for (let i = 0; i < iterable.length; i++) {

      if (!iterable[i - 1]) {url += '?'; }

      url += iterable[i] + '=' + filteringOptions[iterable[i]];

      if (iterable[i + 1]) {url += '&'; }
    }

    return url;
  }
}
