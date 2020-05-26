import { Moment } from 'moment';
import { IEmail } from 'app/shared/model/email.model';
import { IInvoiceItem } from 'app/shared/model/invoice-item.model';
import { IInvoiceHistory } from 'app/shared/model/invoice-history.model';
import { ITrip } from 'app/shared/model/trip.model';
import { ICustomer } from 'app/shared/model/customer.model';
import { IInvoiceReport } from 'app/shared/model/invoice-report.model';
import { TaxType } from 'app/shared/model/enumerations/tax-type.model';
import { CURRENCY } from 'app/shared/model/enumerations/currency.model';
import { InvoiveRef } from 'app/shared/model/enumerations/invoive-ref.model';
import { InvoiceStatus } from 'app/shared/model/enumerations/invoice-status.model';

export interface IInvoice {
  id?: number;
  orderNo?: string;
  invoiceNo?: string;
  taxRate?: number;
  taxType?: TaxType;
  currency?: CURRENCY;
  invoiceTaxTotal?: number;
  invoiceSubTotal?: number;
  invoiceTotal?: number;
  invoiceDate?: Moment;
  invoicePaidDate?: Moment;
  refOption1?: InvoiveRef;
  refValue1?: string;
  refOption2?: InvoiveRef;
  refValue2?: string;
  refOption3?: InvoiveRef;
  refValue3?: string;
  payRefNo?: string;
  invoiceDueDate?: Moment;
  status?: InvoiceStatus;
  invoicePdfContentType?: string;
  invoicePdf?: any;
  remarks?: string;
  customerInfo?: string;
  payterm?: string;
  balance?: number;
  advance?: number;
  discount?: number;
  createdOn?: Moment;
  createdBy?: string;
  updatedOn?: Moment;
  updatedBy?: string;
  notification?: IEmail;
  invoiceItems?: IInvoiceItem[];
  invoiceHistories?: IInvoiceHistory[];
  trip?: ITrip;
  customer?: ICustomer;
  invoiceReports?: IInvoiceReport[];
}

export class Invoice implements IInvoice {
  constructor(
    public id?: number,
    public orderNo?: string,
    public invoiceNo?: string,
    public taxRate?: number,
    public taxType?: TaxType,
    public currency?: CURRENCY,
    public invoiceTaxTotal?: number,
    public invoiceSubTotal?: number,
    public invoiceTotal?: number,
    public invoiceDate?: Moment,
    public invoicePaidDate?: Moment,
    public refOption1?: InvoiveRef,
    public refValue1?: string,
    public refOption2?: InvoiveRef,
    public refValue2?: string,
    public refOption3?: InvoiveRef,
    public refValue3?: string,
    public payRefNo?: string,
    public invoiceDueDate?: Moment,
    public status?: InvoiceStatus,
    public invoicePdfContentType?: string,
    public invoicePdf?: any,
    public remarks?: string,
    public customerInfo?: string,
    public payterm?: string,
    public balance?: number,
    public advance?: number,
    public discount?: number,
    public createdOn?: Moment,
    public createdBy?: string,
    public updatedOn?: Moment,
    public updatedBy?: string,
    public notification?: IEmail,
    public invoiceItems?: IInvoiceItem[],
    public invoiceHistories?: IInvoiceHistory[],
    public trip?: ITrip,
    public customer?: ICustomer,
    public invoiceReports?: IInvoiceReport[]
  ) {}
}
