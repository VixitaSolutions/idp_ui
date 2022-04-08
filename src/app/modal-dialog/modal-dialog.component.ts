import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit {
  @Input() title: string;
  @Input() hasComments: boolean;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  commentsForm: FormGroup;

  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if (this.hasComments) {
      this.commentsForm = this.fb.group({
        comments: new FormControl('', [Validators.required])
      });
    }
  }

  get f(): { [key: string]: AbstractControl } { return this.commentsForm.controls; }

  public decline(): void {
    this.activeModal.close(false);
  }

  public accept(): void {
    if (this.hasComments) {
      return this.activeModal.close(this.commentsForm.getRawValue());
    }
    this.activeModal.close(true);
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }
}
