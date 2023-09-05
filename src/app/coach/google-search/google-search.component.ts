import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchInfo } from 'src/app/_models/googleInfo';

@Component({
  selector: 'app-google-search',
  templateUrl: './google-search.component.html',
  styleUrls: ['./google-search.component.scss']
})
export class GoogleSearchComponent implements OnInit {
  @Input() gInfo: any;
  newdata: any;
  infoItem: any;
  data: any[] = [];
  isButtonDisable: boolean = false;
  Object = Object;
  passData: any[]=[];
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {

    this.data.push(this.gInfo);
    console.log(this.data);
    if(this.gInfo?.Resources){
      this.gInfo = this.gInfo?.Resources;
    }
    else {
      this.gInfo = this.gInfo;
    }
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
    this.activeModal.close(this.passData);
  }

  getCheckBocInfo($event: any, dataResp){
    if($event.currentTarget.checked){
      this.passData.push(dataResp.URL);
    }
    console.log(`${$event}${dataResp}`)
  }
}
