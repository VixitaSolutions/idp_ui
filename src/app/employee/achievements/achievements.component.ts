import { DatePipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { ModalDialogService } from 'src/app/modal-dialog/modal-dialog.service';
import { Client } from 'src/app/_models/admin';
import { ClientService } from 'src/app/_services/client.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {
  manage = true;
  rowsActual: any[] = [];
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
    this.getCourses();
    this.filter.valueChanges.subscribe(text => {
      this.rows = of(this.search(text, this.pipe));
    });
  }

  search(text: string, pipe: PipeTransform): any[] {
      return this.rowsActual.filter(client => {
        const term = text.toLowerCase();
        return client.courseName?.toLowerCase().includes(term)
            || client.employeeName?.toLowerCase().includes(term);
            // || client.subscriptionStartDate ? pipe.transform(client.subscriptionStartDate).includes(term) : true
            // || client.subscriptionEndDate ? pipe.transform(client.subscriptionEndDate).includes(term) : true;
      });
  }
  getCourses(): void {
    this.manage = true;
    // this.isBusy = true;
    // this.clientService.getEmpCourses().subscribe((data) => {
    //   if (data.status === 'SUCCESS') {
    //     this.rowsActual = data.data;
    //     this.collectionSize = this.rowsActual.length;
    //     this.refresh();
    //   }
    //   this.isBusy = false;
    // });
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
              this.getCourses();
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
