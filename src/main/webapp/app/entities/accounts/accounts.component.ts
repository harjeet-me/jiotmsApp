import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccounts } from 'app/shared/model/accounts.model';
import { AccountsService } from './accounts.service';
import { AccountsDeleteDialogComponent } from './accounts-delete-dialog.component';

@Component({
  selector: 'jhi-accounts',
  templateUrl: './accounts.component.html',
})
export class AccountsComponent implements OnInit, OnDestroy {
  accounts?: IAccounts[];
  eventSubscriber?: Subscription;

  constructor(protected accountsService: AccountsService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.accountsService.query().subscribe((res: HttpResponse<IAccounts[]>) => (this.accounts = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInAccounts();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IAccounts): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInAccounts(): void {
    this.eventSubscriber = this.eventManager.subscribe('accountsListModification', () => this.loadAll());
  }

  delete(accounts: IAccounts): void {
    const modalRef = this.modalService.open(AccountsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.accounts = accounts;
  }
}
