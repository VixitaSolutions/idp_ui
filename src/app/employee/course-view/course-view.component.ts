import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from 'src/app/_models/task';

@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['./course-view.component.scss']
})
export class CourseViewComponent implements OnInit {

  @Input() task: Task;
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.activeModal.close();
  }
}
