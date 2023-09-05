import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ModalDialogService } from '../modal-dialog/modal-dialog.service';
import { ClientService } from '../_services/client.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { Client, SortEvent } from '../_models/admin';
import { FormControl } from '@angular/forms';
import { NgbdSortableHeaderDirective } from '../_directives/sortable.directive';

@Component({
  selector: 'app-competency-mapping',
  templateUrl: './competency-mapping.component.html',
  styleUrls: ['./competency-mapping.component.scss'],
})
export class CompetencyMappingComponent implements OnInit {
  clientName: string;
  manage = true;
  rowsActual: any[];
  currentList: any[];
  clientDetails: any;
  searchTerm: string;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  rows: Observable<any[]>;
  public clients: Client[] = [];
  selectedFilter: any;
  filter = new FormControl('');
  @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;
  constructor(
    private clientService: ClientService,
    private toastrService: ToastrService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit(): void {
    this.getClients();
    this.getCompetences();
    // this.filter.valueChanges.subscribe(text => {
    //   if (this.selectedFilter && this.currentList) {
    //     this.rows = of(this.search(text, this.currentList));
    //   } else {
    //     this.rows = of(this.search(text, this.rowsActual));
    //   }
    // });
  }
  getClients() {
    this.clientService.getClients({ status: true }).subscribe((data) => {
      if (data?.length > 0) {
        this.clients = data;
      }
    });
  }
  getCompetences() {
    this.clientService.getCompetenciesDetails().subscribe((resp) => {
      if(resp){
        this.rowsActual = resp;
        this.currentList = this.rowsActual;
        this.refresh()
      }
    });
  }

  refresh(): void {
    this.collectionSize = this.currentList.length;
    this.rows = of(
      this.currentList
        .map((country, i) => ({ id: i + 1, ...country }))
        .slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize
        )
    );
    console.log(this.rows)
  }

  addMapping(): void {
    this.manage = false;
  }
  search(text: string, list): any[] {
    return list.filter(competency => {
      const term = text.toLowerCase();
      return competency.cName?.toLowerCase().includes(term)
        || competency.gName?.toLowerCase().includes(term)
        || competency.description?.toLowerCase().includes(term)
        || competency.keywords?.toLowerCase().includes(term)
        || competency.tenantId?.toLowerCase().includes(term)
    });
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
    //this.refresh();
  }
  applyFilter(id: string, name: string): void {
    if (id !== undefined) {
      this.selectedFilter = name;
      if (this.filter.value) {
        const cList: any[] = this.search(this.filter.value, this.rowsActual);
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
}
const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
