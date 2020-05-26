import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IEmail } from 'app/shared/model/email.model';

type EntityResponseType = HttpResponse<IEmail>;
type EntityArrayResponseType = HttpResponse<IEmail[]>;

@Injectable({ providedIn: 'root' })
export class EmailService {
  public resourceUrl = SERVER_API_URL + 'api/emails';

  constructor(protected http: HttpClient) {}

  create(email: IEmail): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(email);
    return this.http
      .post<IEmail>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(email: IEmail): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(email);
    return this.http
      .put<IEmail>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEmail>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEmail[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(email: IEmail): IEmail {
    const copy: IEmail = Object.assign({}, email, {
      sentDateTime: email.sentDateTime && email.sentDateTime.isValid() ? email.sentDateTime.toJSON() : undefined,
      createdOn: email.createdOn && email.createdOn.isValid() ? email.createdOn.toJSON() : undefined,
      updatedOn: email.updatedOn && email.updatedOn.isValid() ? email.updatedOn.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.sentDateTime = res.body.sentDateTime ? moment(res.body.sentDateTime) : undefined;
      res.body.createdOn = res.body.createdOn ? moment(res.body.createdOn) : undefined;
      res.body.updatedOn = res.body.updatedOn ? moment(res.body.updatedOn) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((email: IEmail) => {
        email.sentDateTime = email.sentDateTime ? moment(email.sentDateTime) : undefined;
        email.createdOn = email.createdOn ? moment(email.createdOn) : undefined;
        email.updatedOn = email.updatedOn ? moment(email.updatedOn) : undefined;
      });
    }
    return res;
  }
}
