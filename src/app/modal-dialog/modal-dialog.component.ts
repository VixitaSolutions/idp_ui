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
  progressForm: FormGroup;
  @Input() hasProgress: boolean;
  @Input() progress = 0;

  constructor(private fb: FormBuilder, private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    if (this.hasComments) {
      this.commentsForm = this.fb.group({
        comments: new FormControl('', [Validators.required])
      });
    }
    if (this.hasProgress) {
      this.progressForm = this.fb.group({
        progress: new FormControl(this.progress, [Validators.required, Validators.min(1), Validators.max(100),
          Validators.pattern(/^[1-9][0-9]?$|^100$/)])
      });
    }
  }

  get f(): { [key: string]: AbstractControl } { return this.commentsForm.controls; }
  get p(): { [key: string]: AbstractControl } { return this.progressForm.controls; }

  public decline(): void {
    this.activeModal.close(false);
  }

  public accept(): void {
    if (this.hasComments) {
      return this.activeModal.close(this.commentsForm.getRawValue());
    }
    if (this.hasProgress) {
      return this.activeModal.close(this.progressForm.getRawValue());
    }
    this.activeModal.close(true);
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }
}
