import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  @Input() task: any;
  // feedBackForm = new FormGroup({
  //   ctrl: new FormControl(null, Validators.required),
  //   feedback: new FormControl(null, Validators.required),
  // });
  ctrl = new FormControl(null, Validators.required);
  feedback = new FormControl(null, Validators.required);
  rating = -1;
  toggle() {
    if (this.ctrl.disabled) {
      this.ctrl.enable();
    } else {
      this.ctrl.disable();
    }
  }
  starRating = 0;
  currentRate = 3.14;
  constructor(private activeModal: NgbActiveModal,private toastrService: ToastrService, private feedbackService: UserService) { }

  ngOnInit(): void {
  }
  public dismiss(): void {
    this.activeModal.dismiss();
  }
  submitFeedback(){
    const obj = {
      feedback: this.feedback,
      rating: this.rating
    }
    this.feedbackService.saveFeedback(obj).subscribe(resp=>{
        if(resp){
          this.toastrService.success('Feedback Saved successfully', 'Success');
          this.activeModal.dismiss();
        }
    }, error =>{
      this.toastrService.error('Failed to update the feedback', 'Failure');
    })
  }
}
