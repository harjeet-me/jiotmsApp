import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IProductItem } from 'app/shared/model/product-item.model';

type EntityResponseType = HttpResponse<IProductItem>;
type EntityArrayResponseType = HttpResponse<IProductItem[]>;

@Injectable({ providedIn: 'root' })
export class ProductItemService {
  public resourceUrl = SERVER_API_URL + 'api/product-items';

  constructor(protected http: HttpClient) {}

  create(productItem: IProductItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productItem);
    return this.http
      .post<IProductItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productItem: IProductItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productItem);
    return this.http
      .put<IProductItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductItem>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductItem[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(productItem: IProductItem): IProductItem {
    const copy: IProductItem = Object.assign({}, productItem, {
      createdOn: productItem.createdOn && productItem.createdOn.isValid() ? productItem.createdOn.toJSON() : undefined,
      updatedOn: productItem.updatedOn && productItem.updatedOn.isValid() ? productItem.updatedOn.toJSON() : undefined,
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
      res.body.forEach((productItem: IProductItem) => {
        productItem.createdOn = productItem.createdOn ? moment(productItem.createdOn) : undefined;
        productItem.updatedOn = productItem.updatedOn ? moment(productItem.updatedOn) : undefined;
      });
    }
    return res;
  }
}
