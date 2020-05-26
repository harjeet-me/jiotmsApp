import { Moment } from 'moment';
import { IFileSystem } from 'app/shared/model/file-system.model';
import { ICustomer } from 'app/shared/model/customer.model';

export interface IEmail {
  id?: number;
  userto?: string;
  usercc?: string;
  userbcc?: string;
  subject?: string;
  message?: string;
  multipart?: boolean;
  htmlBody?: boolean;
  attachmentContentType?: string;
  attachment?: any;
  attachmentName?: string;
  status?: string;
  sentDateTime?: Moment;
  createdOn?: Moment;
  createdBy?: string;
  updatedOn?: Moment;
  updatedBy?: string;
  fileSystems?: IFileSystem[];
  customer?: ICustomer;
}

export class Email implements IEmail {
  constructor(
    public id?: number,
    public userto?: string,
    public usercc?: string,
    public userbcc?: string,
    public subject?: string,
    public message?: string,
    public multipart?: boolean,
    public htmlBody?: boolean,
    public attachmentContentType?: string,
    public attachment?: any,
    public attachmentName?: string,
    public status?: string,
    public sentDateTime?: Moment,
    public createdOn?: Moment,
    public createdBy?: string,
    public updatedOn?: Moment,
    public updatedBy?: string,
    public fileSystems?: IFileSystem[],
    public customer?: ICustomer
  ) {
    this.multipart = this.multipart || false;
    this.htmlBody = this.htmlBody || false;
  }
}
