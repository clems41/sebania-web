import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {Observable} from 'rxjs';
import {FeedbackRequest} from '../models/contact/feedback-request';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contactPrefix = '/contact';

  constructor(private httpService: HttpService) { }

  sendFeedback(request: FeedbackRequest): Observable<null> {
    return this.httpService.post(`${this.contactPrefix}/`, request);
  }
}
