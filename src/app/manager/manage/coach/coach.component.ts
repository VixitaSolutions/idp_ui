import { DatePipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { ModalDialogService } from 'src/app/modal-dialog/modal-dialog.service';
import { Client } from 'src/app/_models/admin';
import { Role } from 'src/app/_models/role';
import { ClientService } from 'src/app/_services/client.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.scss']
})
export class CoachComponent implements OnInit {

  manage = true;
  userId: string;
  rowsActual: Client[] = [];
  coachDetails: any;
  searchTerm: string;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  rows: Observable<Client[]>;
  filter = new FormControl('');
  isBusy: boolean;
  tenantId: string;

  constructor(
    private pipe: DatePipe,
    private modalDialogService: ModalDialogService,
    private clientService: ClientService,
    private userService: UserService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
    const obj = JSON.parse(sessionStorage.getItem('currentUser'));
    this.userId = obj?.userId;
    // this.loggedInUserId = Number.parseInt(obj.userId, 10);
    if (obj?.tenantId) {
      this.tenantId = obj.tenantId;
      this.getCoaches();
    }
    this.filter.valueChanges.subscribe(text => {
      this.rows = of(this.search(text, this.pipe));
    });
  }

  search(text: string, pipe: PipeTransform): Client[] {
      return this.rowsActual.filter(client => {
        const term = text.toLowerCase();
        return client.clientName?.toLowerCase().includes(term)
            || client.mobile?.toLowerCase().includes(term)
            || client.email?.toLowerCase().includes(term);
      });
  }
  getCoaches(): void {
    this.manage = true;
    this.isBusy = true;
    const payload = {roleId: Role.Coach, tenantId: this.tenantId};
    this.userService.getEmployees(payload).subscribe((data) => {
      if (data.status === 'SUCCESS') {
        this.rowsActual = (data.message === 'User Not found') ? [] : data.data;
        this.collectionSize = this.rowsActual.length;
        this.refresh();
      }
      this.isBusy = false;
    });
  }
  edit(id): void {
    if (id !== undefined) {
      this.manage = false;
      this.coachDetails = this.rowsActual.filter(i => i.id === id)[0];
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
              this.getCoaches();
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
    this.coachDetails = undefined;
  }
  refresh(): void {
    this.rows = of(this.rowsActual
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize));
  }

}
