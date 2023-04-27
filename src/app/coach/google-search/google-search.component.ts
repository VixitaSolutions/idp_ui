import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchInfo } from 'src/app/_models/googleInfo';

@Component({
  selector: 'app-google-search',
  templateUrl: './google-search.component.html',
  styleUrls: ['./google-search.component.scss']
})
export class GoogleSearchComponent implements OnInit {
  @Input() gInfo: SearchInfo;
  newdata: any;
  infoItem: any;
  isButtonDisable: boolean = false;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log(this.gInfo);
  //   this.gInfo.value.forEach((element:any, index) => {
  //   if(element.pagemap){
  //     if(element.pagemap?.cse_thumbnail){
  //       this.gInfo.value[index]['img'] = element.pagemap.cse_thumbnail[0].src;
  //     }
  //     else {
  //       this.gInfo.value[index]['img'] = null;
  //     }
  //   }
    
  //  });
  }
  addItem(info: any){
    this.isButtonDisable = true;
    this.infoItem = info;
    console.log(this.infoItem);
  }
  closeModal(sendData: any) {
    this.activeModal.close(this.infoItem);
  }
}
