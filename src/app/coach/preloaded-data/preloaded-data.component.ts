import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-preloaded-data',
  templateUrl: './preloaded-data.component.html',
  styleUrls: ['./preloaded-data.component.scss']
})
export class PreloadedDataComponent implements OnInit {
  @Input() gInfo: any[] = [];
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
    if(this.gInfo){
      // this.gInfo = this.gInfo.OnlineCourses;
    }
    else {
      this.gInfo = this.gInfo;
    }
  }
  addItem(info: any){
    this.isButtonDisable = true;
    this.infoItem = info;
    console.log(this.infoItem);
  }
  closeModal(sendData: any) {
    this.activeModal.close(this.passData);
  }

  getCheckBocInfo($event: any, dataResp: any, resp: string){
    if($event.currentTarget.checked){
      if(resp == 'books'){
        this.passData.push(dataResp.b_url);
      }
      if(resp == 'course'){
        this.passData.push(dataResp.oc_url);
      }
      if(resp == 'youtube'){
        this.passData.push(dataResp.y_url);
      }

    }
    console.log(`${$event}${dataResp}`)
  }
}
