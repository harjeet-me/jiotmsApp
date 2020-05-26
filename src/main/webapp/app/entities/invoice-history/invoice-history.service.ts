import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IInvoiceHistory } from 'app/shared/model/invoice-history.model';

type EntityResponseType = HttpResponse<IInvoiceHistory>;
type EntityArrayResponseType = HttpResponse<IInvoiceHistory[]>;

@Injectable({ providedIn: 'root' })
export class InvoiceHistoryService {
  public resourceUrl = SERVER_API_URL + 'api/invoice-histories';

  constructor(protected http: HttpClient) {}

  create(invoiceHistory: IInvoiceHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoiceHistory);
    return this.http
      .post<IInvoiceHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(invoiceHistory: IInvoiceHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoiceHistory);
    return this.http
      .put<IInvoiceHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IInvoiceHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IInvoiceHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(invoiceHistory: IInvoiceHistory): IInvoiceHistory {
    const copy: IInvoiceHistory = Object.assign({}, invoiceHistory, {
      createdOn: invoiceHistory.createdOn && invoiceHistory.createdOn.isValid() ? invoiceHistory.createdOn.toJSON() : undefined,
      updatedOn: invoiceHistory.updatedOn && invoiceHistory.updatedOn.isValid() ? invoiceHistory.updatedOn.toJSON() : undefined,
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
      res.body.forEach((invoiceHistory: IInvoiceHistory) => {
        invoiceHistory.createdOn = invoiceHistory.createdOn ? moment(invoiceHistory.createdOn) : undefined;
        invoiceHistory.updatedOn = invoiceHistory.updatedOn ? moment(invoiceHistory.updatedOn) : undefined;
      });
    }
    return res;
  }
}
