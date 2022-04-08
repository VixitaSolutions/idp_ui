import { Component, OnInit, PipeTransform } from '@angular/core';
import { ModalDialogService } from '../modal-dialog/modal-dialog.service';
import { ClientService } from '../_services/client.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Client } from '../_models/admin';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-manage-clients',
  templateUrl: './manage-clients.component.html',
  styleUrls: ['./manage-clients.component.scss'],
  providers: [DatePipe]
})
export class ManageClientsComponent implements OnInit {

  manage = true;
  rowsActual: Client[] = [];
  clientDetails: any;
  searchTerm: string;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  rows: Observable<Client[]>;
  filter = new FormControl('');
  isBusy: boolean;

  constructor(
    private pipe: DatePipe,
    private modalDialogService: ModalDialogService,
    private clientService: ClientService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getClients();
    this.filter.valueChanges.subscribe(text => {
      this.rows = of(this.search(text, this.pipe));
    });
  }

  search(text: string, pipe: PipeTransform): Client[] {
      return this.rowsActual.filter(client => {
        const term = text.toLowerCase();
        return client.clientName?.toLowerCase().includes(term)
            || client.mobile?.toLowerCase().includes(term)
            // || (client.status)
            || client.email?.toLowerCase().includes(term);
            // || client.subscriptionStartDate ? pipe.transform(client.subscriptionStartDate).includes(term) : true
            // || client.subscriptionEndDate ? pipe.transform(client.subscriptionEndDate).includes(term) : true;
      });
  }
  getClients(): void {
    this.manage = true;
    this.isBusy = true;
    this.clientService.getClients({status: true}).subscribe((data) => {
      if (data) {
        this.rowsActual = data;
        this.collectionSize = this.rowsActual.length;
        this.refresh();
      }
      this.isBusy = false;
    });
  }
  edit(id): void {
    if (id !== undefined) {
      this.manage = false;
      this.clientDetails = this.rowsActual.filter(i => i.id === id)[0];
    }
  }

  delete(id): void {
    if (id !== undefined) {
      this.modalDialogService.confirm('', 'Are you sure want to Delete?', 'Yes', 'Cancel', 'lg')
      .then((confirmed: boolean) => {
        if (confirmed) {
          console.log('Deleted', confirmed);
          this.isBusy = true;
          this.clientService.delete(id).subscribe(data => {
            if (data.status === 'SUCCESS') {
              this.toastrService.success('Client deleted successfully', 'Success');
              this.getClients();
            } else {
              this.toastrService.error('Client deleted failed', 'Failure');
            }
            this.isBusy = false;
          });
          return;
        }
      })
      .catch(() => {
        this.isBusy = false;
        this.toastrService.error(`Client Deletion failed`, 'Failure');
      });
    }
  }
  addClient(): void {
    this.manage = false;
    this.clientDetails = undefined;
  }
  refresh(): void {
    this.rows = of(this.rowsActual
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize));
  }
}
