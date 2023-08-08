import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../_helpers/Constants';
import { Client } from '../_models/admin';
import { ClientService } from '../_services/client.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-preloaded-data',
  templateUrl: './preloaded-data.component.html',
  styleUrls: ['./preloaded-data.component.scss']
})
export class PreloadedDataComponent implements OnInit {
  url = Constants.samplePreloadDataFilePath;
  title = 'Upload';
  tenantId = new FormControl(undefined, [Validators.required]);
  client: string;
  files: any[] = [];
  isBusy: boolean;
  clients: Client[];
  uploadFile = new FormControl();
  progress = 0;
  fileError: string;
  progressInterval: any;

  constructor(
    private userService: UserService,
    private toastService: ToastrService,
    private clientService: ClientService) { }

  ngOnInit(): void {
    this.uploadFile.valueChanges.subscribe(data => {
      console.log(data);
    });
  }

  downloadSampleFile(): void {
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = Constants.samplePreloadDataFilePath;
    link.download = 'preloadeddata.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  /**
   * on file drop handler
   */
  onFileDropped($event): void {
    this.fileError = undefined;
    if (this.files.length === 0) {
      this.prepareFilesList($event);
    } else {
      this.fileError = 'Max files accepted only One';
    }
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files): void {
    this.fileError = undefined;
    if (this.files.length === 0) {
    this.prepareFilesList(files);
    } else {
      this.fileError = 'Max files accepted only One';
    }
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number): void {
    // this.files.splice(index, 1);
    this.files = [];
    this.uploadFile = undefined;
    clearInterval(this.progressInterval);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number): void {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        this.progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(this.progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>): void {
    // for (const item of files) {
      this.fileError = undefined;
      files[0].progress = 0;
      if (['application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/csv'].includes(files[0].type)) {
        this.files.push(files[0]);
        this.uploadFilesSimulator(0);
      } else {
        this.fileError = 'Invalid File';
      }
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // get f(): { [key: string]: AbstractControl } { return this.uploadForm.controls; }
  save(): void {
    if (this.files.length > 0) {
      this.isBusy = true;
      this.userService.uploadPreloadedData(this.files[0]).subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          if (event.body.data) {
            if (event.body.data?.uploadedUser > 0) {
              this.toastService.success(`Uploaded User Count: ${event.body.data?.uploadedUser}`, 'Success');
            } else {
              this.toastService.error(`Uploaded User Count: ${event.body.data?.uploadedUser}`, 'Failure');
              Object.entries(event?.body?.data?.newSkippedUser).forEach((v, k) => {
                this.toastService.error(`Row: ${v[0]}, Reason: ${v[1]}`, 'Failure');
              });
            }
          }
          this.files = [];
          this.uploadFile = undefined;
          this.isBusy = false;
        }
      },
      (err: any) => {
        console.log(err);
        this.progress = 0;
        let message;
        if (err.error && err.error.message) {
          message = err.error.message;
        } else {
          message = 'Could not upload the file!';
        }
        this.toastService.error(message, 'Failure');
        this.files = [];
        this.uploadFile = undefined;
        this.isBusy = false;
      });
    } else {
      this.tenantId.markAsTouched();
    }
  }


  reset(): void {
  }

}
