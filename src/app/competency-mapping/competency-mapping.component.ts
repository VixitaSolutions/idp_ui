import { Component, OnInit } from '@angular/core';
import { ModalDialogService } from '../modal-dialog/modal-dialog.service';

@Component({
  selector: 'app-competency-mapping',
  templateUrl: './competency-mapping.component.html',
  styleUrls: ['./competency-mapping.component.scss']
})
export class CompetencyMappingComponent implements OnInit {

  clientName: string;
  manage = true;
  rowsActual: any;
  clientDetails: any;
  searchTerm: string;
  page = 1;
  pageSize = 4;
  collectionSize = 0;
  rows: any;

  constructor(private modalDialogService: ModalDialogService) { }

  ngOnInit(): void {
    this.rowsActual = [
      {id: 1, clientCompetency: 'JAVA', clientCompetencyId: 1, globalCompetency: 'Spring', globalCompetencyId: 1, keywords: 'Active' },
      {id: 2, clientCompetency: 'Struts', clientCompetencyId: 2, globalCompetency: 'Spring', globalCompetencyId: 1, keywords: 'Active' },
      {id: 3, clientCompetency: 'HTML', clientCompetencyId: 3, globalCompetency: 'HTML', globalCompetencyId: 2, keywords: 'Active' },
      {id: 4, clientCompetency: 'CSS', clientCompetencyId: 4, globalCompetency: 'HTML', globalCompetencyId: 2, keywords: 'Active' }
    ];

    this.collectionSize = this.rowsActual.length;
    this.refresh();
  }

  edit(id): void {
    console.log(id);
    if (id !== undefined) {
      this.manage = false;
      this.clientDetails = this.rows.filter(i => i.id === id)[0];
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
  addMapping(): void {
    this.manage = false;
  }
  refresh(): void {
    this.rows = this.rowsActual
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

}
