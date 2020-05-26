import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IContainer } from 'app/shared/model/container.model';

type EntityResponseType = HttpResponse<IContainer>;
type EntityArrayResponseType = HttpResponse<IContainer[]>;

@Injectable({ providedIn: 'root' })
export class ContainerService {
  public resourceUrl = SERVER_API_URL + 'api/containers';

  constructor(protected http: HttpClient) {}

  create(container: IContainer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(container);
    return this.http
      .post<IContainer>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(container: IContainer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(container);
    return this.http
      .put<IContainer>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IContainer>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IContainer[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(container: IContainer): IContainer {
    const copy: IContainer = Object.assign({}, container, {
      createdOn: container.createdOn && container.createdOn.isValid() ? container.createdOn.toJSON() : undefined,
      updatedOn: container.updatedOn && container.updatedOn.isValid() ? container.updatedOn.toJSON() : undefined,
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
      res.body.forEach((container: IContainer) => {
        container.createdOn = container.createdOn ? moment(container.createdOn) : undefined;
        container.updatedOn = container.updatedOn ? moment(container.updatedOn) : undefined;
      });
    }
    return res;
  }
}
