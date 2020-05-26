import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ITransactionsRecord } from 'app/shared/model/transactions-record.model';

type EntityResponseType = HttpResponse<ITransactionsRecord>;
type EntityArrayResponseType = HttpResponse<ITransactionsRecord[]>;

@Injectable({ providedIn: 'root' })
export class TransactionsRecordService {
  public resourceUrl = SERVER_API_URL + 'api/transactions-records';

  constructor(protected http: HttpClient) {}

  create(transactionsRecord: ITransactionsRecord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transactionsRecord);
    return this.http
      .post<ITransactionsRecord>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(transactionsRecord: ITransactionsRecord): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(transactionsRecord);
    return this.http
      .put<ITransactionsRecord>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITransactionsRecord>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITransactionsRecord[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(transactionsRecord: ITransactionsRecord): ITransactionsRecord {
    const copy: ITransactionsRecord = Object.assign({}, transactionsRecord, {
      createdOn: transactionsRecord.createdOn && transactionsRecord.createdOn.isValid() ? transactionsRecord.createdOn.toJSON() : undefined,
      updatedOn: transactionsRecord.updatedOn && transactionsRecord.updatedOn.isValid() ? transactionsRecord.updatedOn.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdOn = res.body.createdOn ? moment(res.body.createdOn) : undefined;
      res.body.updatedOn = res.body.updatedOn ? moment(res.body.updatedOn) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((transactionsRecord: ITransactionsRecord) => {
        transactionsRecord.createdOn = transactionsRecord.createdOn ? moment(transactionsRecord.createdOn) : undefined;
        transactionsRecord.updatedOn = transactionsRecord.updatedOn ? moment(transactionsRecord.updatedOn) : undefined;
      });
    }
    return res;
  }
}
