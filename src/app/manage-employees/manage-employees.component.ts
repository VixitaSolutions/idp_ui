import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ModalDialogService } from '../modal-dialog/modal-dialog.service';
import { NgbdSortableHeaderDirective } from '../_directives/sortable.directive';
import { Client, SortEvent } from '../_models/admin';
import { User } from '../_models/user';
import { ClientService } from '../_services/client.service';

@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.scss']
})
export class ManageEmployeesComponent implements OnInit {
  manage = true;
  rowsActual: User[];
  currentList: User[];
  selectedFilter: string;
  employeeDetails: any;
  searchTerm: string;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  clients: Client[];
  rows: Observable<User[]>;
  isBusy: boolean;
  filter = new FormControl('');
  @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;

  constructor(
    private modalDialogService: ModalDialogService,
    private clientService: ClientService) { }

  ngOnInit(): void {
    this.getEmployees();
    this.filter.valueChanges.subscribe(text => {
      if (this.selectedFilter && this.currentList) {
        this.rows = of(this.search(text, this.currentList));
      } else {
        this.rows = of(this.search(text, this.rowsActual));
      }
    });
  }

  search(text: string, list): User[] {
    return list.filter(user => {
      const term = text.toLowerCase();
      return user.tenantName?.toLowerCase().includes(term)
        || user.mobile?.toLowerCase().includes(term)
        || user.firstName?.toLowerCase().includes(term)
        || user.lastName?.toLowerCase().includes(term)
        || user.email?.toLowerCase().includes(term);
    });
  }

  getEmployees(): void {
    this.isBusy = true;
    this.clientService.getClients({status: true}).subscribe(data => {
      if (data) {
        this.clients = data;
      }
      this.isBusy = false;
    });
    this.clientService.getUsers(null, null).subscribe(data => {
      if (data.status === 'SUCCESS') {
        this.rowsActual = data.data;
        this.rowsActual.forEach(row => {
          row.tenantName = this.clients.find(client => client.id === row.tenantId).clientName;
        });
        this.currentList = this.rowsActual;
        // this.collectionSize = this.rowsActual.length;
        this.refresh();
      }
      this.isBusy = false;
    });
  }
  edit(id): void {
    console.log(id);
    if (id !== undefined) {
      this.manage = false;
      this.employeeDetails = this.rowsActual.filter(i => i.id === id)[0];
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
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
  }
  addClient(): void {
    this.manage = false;
  }
  refresh(): void {
    this.collectionSize = this.currentList.length;
    this.rows = of(this.currentList
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize));
  }

  applyFilter(id: string, name: string): void {
    if (id !== undefined) {
      this.selectedFilter = name;
      if (this.filter.value) {
        const cList: User[] = this.search(this.filter.value, this.rowsActual);
        this.currentList = cList.filter(user => user.tenantId === id);
      } else {
        this.currentList = this.rowsActual.filter(user => user.tenantId === id);
      }
      this.refresh();
    } else {
      if (this.filter.value) {
        this.currentList = this.search(this.filter.value, this.rowsActual);
      } else {
        this.currentList = this.rowsActual;
      }
      this.selectedFilter = undefined;
      this.refresh();
    }
  }

  onSort({column, direction}: SortEvent): void {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      this.currentList = this.rowsActual;
    } else {
      this.currentList = [...this.rowsActual].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
    this.refresh();
  }
}
const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
