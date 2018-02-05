import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class JasCommunicationsService {
  public subject: Subject<any> = new Subject<any>();

  constructor() {
  }

  public get getSubscribe(): Observable<any> {
    return this.subject.asObservable();
  }

  public sendMessage(info) {
    this.subject.next(info);
  }
}
