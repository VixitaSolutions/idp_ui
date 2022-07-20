import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ModalDialogService } from '../modal-dialog/modal-dialog.service';
import { Client } from '../_models/admin';
import { Role } from '../_models/role';
import { User } from '../_models/user';
import { ClientService } from '../_services/client.service';

@Component({
  selector: 'app-manage-admins',
  templateUrl: './manage-admins.component.html',
  styleUrls: ['./manage-admins.component.scss']
})
export class ManageAdminsComponent implements OnInit {
  manage = true;
  rowsActual: User[];
  adminDetails: any;
  searchTerm: string;
  page = 1;
  pageSize = 4;
  collectionSize = 0;
  rows: Observable<User[]>;
  isBusy: boolean;
  clients: Client[];
  filter = new FormControl('');
  constructor(
    private modalDialogService: ModalDialogService,
    private clientService: ClientService) { }

  ngOnInit(): void {
    this.getAdmins();
    this.filter.valueChanges.subscribe(text => {
      const filteredRows: User[] = this.search(text);
      this.rows = of(filteredRows);
      this.collectionSize = filteredRows.length;
    });
  }
  search(text: string): User[] {
    return this.rowsActual.filter(user => {
      const term = text.toLowerCase();
      return user.tenantName?.toLowerCase().includes(term)
        || user.mobile?.toLowerCase().includes(term)
        || user.firstName?.toLowerCase().includes(term)
        || user.lastName?.toLowerCase().includes(term)
        || user.email?.toLowerCase().includes(term);
    });
  }

  getAdmins(): void {
    this.manage = true;
    this.isBusy = true;
    this.clientService.getClients({status: true}).subscribe(data => {
      if (data) {
        this.clients = data;
        this.clientService.getUsers(null, Role.Manager).subscribe((users: any) => {
          if (users.status === 'SUCCESS') {
            this.rowsActual = users.data;
            this.rowsActual.forEach(row => {
              row.tenantName = this.clients.find(client => client.id === row.tenantId).clientName;
            });
            this.collectionSize = this.rowsActual.length;
            this.refresh();
          }
          this.isBusy = false;
        });
      }
    });
  }
  addAdmin(): void {
    this.manage = !this.manage;
    this.adminDetails = undefined;
  }
  edit(id): void {
    console.log(id);
    if (id !== undefined) {
      this.manage = false;
      this.adminDetails = this.rowsActual.filter(i => i.id === id)[0];
    }
  }

  delete(id): void {
    if (id !== undefined) {
      this.modalDialogService.confirm('', 'Are you sure want to Delete?', 'Yes', 'Cancel', 'lg')
        .then((confirmed: boolean) => {
          if (confirmed) {
            console.log('Deleted', confirmed);
            return;
          }
          console.log('Dont delete:', confirmed);
        })
        .catch(() =>
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
  }
  addClient(): void {
    this.manage = false;
  }
  refresh(): void {
    this.rows = of(this.rowsActual
      .map((country, i) => ({ id: i + 1, ...country }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize));
  }
  clearSearch(): void {
    this.filter.setValue(undefined);
  }
}
