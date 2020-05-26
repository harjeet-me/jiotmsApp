import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IAccountHistory } from 'app/shared/model/account-history.model';

type EntityResponseType = HttpResponse<IAccountHistory>;
type EntityArrayResponseType = HttpResponse<IAccountHistory[]>;

@Injectable({ providedIn: 'root' })
export class AccountHistoryService {
  public resourceUrl = SERVER_API_URL + 'api/account-histories';

  constructor(protected http: HttpClient) {}

  create(accountHistory: IAccountHistory): Observable<EntityResponseType> {
    return this.http.post<IAccountHistory>(this.resourceUrl, accountHistory, { observe: 'response' });
  }

  update(accountHistory: IAccountHistory): Observable<EntityResponseType> {
    return this.http.put<IAccountHistory>(this.resourceUrl, accountHistory, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccountHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccountHistory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
