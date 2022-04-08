import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../_services/client.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {

  @Input() clientDetails;
  @Output() closeEvent = new EventEmitter<boolean>();
  addClientForm: FormGroup;
  id: string;
  clientName: string;
  clientDescription: string;
  mobile: string;
  email: string;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  status: boolean;
  title = 'Add Client';
  disableName: boolean;
  isBusy: boolean;

  constructor(private clientService: ClientService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    if (this.clientDetails !== undefined) {
      this.title = 'Edit Client';
      this.id = this.clientDetails.id;
      this.clientName = this.clientDetails.clientName;
      this.clientDescription = this.clientDetails.clientDescription;
      this.mobile = this.clientDetails.mobile;
      this.email = this.clientDetails.email;
      this.subscriptionStartDate = this.clientDetails.subscriptionStartDate;
      this.subscriptionEndDate = this.clientDetails.subscriptionEndDate;
      this.status = this.clientDetails?.status;
      this.disableName = true;
    }
    this.addClientForm = new FormGroup({
      id: new FormControl(this.id),
      clientName: new FormControl({value: this.clientName, disabled: this.isDisable}, [Validators.required]),
      clientDescription: new FormControl(this.clientDescription),
      mobile: new FormControl(this.mobile, [Validators.required]),
      email: new FormControl(this.email, [Validators.required]),
      subscriptionStartDate: new FormControl(this.formatToNgbDate(this.subscriptionStartDate), [Validators.required]),
      subscriptionEndDate: new FormControl(this.formatToNgbDate(this.subscriptionEndDate)),
      status: new FormControl(this.status, [Validators.required])
    });
  }

  get f(): { [key: string]: AbstractControl } { return this.addClientForm.controls; }

  get isDisable(): boolean { return this.disableName; }
  formatToNgbDate(date): NgbDate {
    if (date !== undefined && date !== '' && date !== null) {
      const d = new Date(date);
      return new NgbDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
    }
    return null;
  }
  save(): void {
    if (this.addClientForm.valid) {
      this.isBusy = true;
      const payload = this.addClientForm.getRawValue();
      payload.subscriptionStartDate = this.formatDate(payload?.subscriptionStartDate);
      payload.subscriptionEndDate = this.formatDate(payload?.subscriptionEndDate);
      this.clientService.saveClient(payload).subscribe((data) => {
        if (data.status === 'SUCCESS') {
          this.toastrService.success('Client saved successfully', 'Success');
          this.closeEvent.emit(true);
        } else {
          this.toastrService.error(`${data?.message}`, 'Failure');
        }
        this.isBusy = false;
      });
    } else {
      Object.keys(this.addClientForm.controls).forEach(control => {
        if (this.addClientForm.get(control).invalid) {
          this.addClientForm.get(control).markAsTouched();
        }
      });
    }
  }
  formatDate(event): Date {
    if (event?.year && event?.day && event?.month) {
      return this.subscriptionStartDate = new Date(event?.year, parseInt(event?.month, 10) - 1, event?.day);
    }
    return undefined;
  }
}
