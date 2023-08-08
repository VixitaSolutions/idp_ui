import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PreloadedData, SortEvent } from '../_models/admin';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgbdSortableHeaderDirective } from '../_directives/sortable.directive';
import { ModalDialogService } from '../modal-dialog/modal-dialog.service';
import { ClientService } from '../_services/client.service';

@Component({
  selector: 'app-manage-preloadeddata',
  templateUrl: './manage-preloadeddata.component.html',
  styleUrls: ['./manage-preloadeddata.component.scss']
})
export class ManagePreloadeddataComponent implements OnInit {
  manage = true;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  preloadedData: PreloadedData[];
  rowsActual: PreloadedData[];
  currentList: PreloadedData[];
  rows: Observable<PreloadedData[]>;
  isBusy: boolean;
  filter = new FormControl('');
  filter1 = new FormControl('');
  filter2 = new FormControl('');
  selectedFilter: string;
  @ViewChildren(NgbdSortableHeaderDirective) headers: QueryList<NgbdSortableHeaderDirective>;
  constructor(private modalDialogService: ModalDialogService,
    private clientService: ClientService) { }

  ngOnInit(): void {
    this.getPreloadedData();
    this.manage = true;
    this.filter.valueChanges.subscribe(text => {
      if (this.selectedFilter && this.currentList) {
        this.rows = of(this.search(text, this.currentList));
      } else {
        this.rows = of(this.search(text, this.rowsActual));
      }
    });
    this.filter1.valueChanges.subscribe(text => {
      if (this.selectedFilter && this.currentList) {
        this.rows = of(this.search1(text, this.currentList));
      } else {
        this.rows = of(this.search1(text, this.rowsActual));
      }
    });
    this.filter2.valueChanges.subscribe(text => {
      if (this.selectedFilter && this.currentList) {
        this.rows = of(this.search2(text, this.currentList));
      } else {
        this.rows = of(this.search2(text, this.rowsActual));
      }
    });
  }

  search(text: string, list): PreloadedData[] {
    return list.filter(data => {
      const term = text.toLowerCase();
      return data.bAuthor?.toLowerCase().includes(term)
        || data.bPublisher?.toLowerCase().includes(term)
        || data.bTitle?.toLowerCase().includes(term)
        || data.bUrl?.toLowerCase().includes(term);
    });
  }

  search1(text: string, list): PreloadedData[] {
    return list.filter(data => {
      const term = text.toLowerCase();
      return data.ocCourse?.toLowerCase().includes(term)
        || data.ocDescription?.toLowerCase().includes(term)
        || data.ocUrl?.toLowerCase().includes(term)
        || data.ocPlatform?.toLowerCase().includes(term);
    });
  }

  search2(text: string, list): PreloadedData[] {
    return list.filter(data => {
      const term = text.toLowerCase();
      return data.yName?.toLowerCase().includes(term)
        || data.bPublisher?.toLowerCase().includes(term)
        || data.yDescription?.toLowerCase().includes(term)
        || data.yUrl?.toLowerCase().includes(term);
    });
  }
  getPreloadedData(){
    this.clientService.getPreloadedData().subscribe(resp => {
      if (resp) {
        this.rowsActual = resp;
        this.currentList = this.rowsActual;
        // this.collectionSize = this.rowsActual.length;
        this.refresh();
      }
      this.isBusy = false;
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

  refresh(): void {
    this.collectionSize = this.currentList.length;
    this.rows = of(this.currentList
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize));
  }

}
const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
