import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  @Input() user;
  @Output() exitProfile = new EventEmitter<boolean>();
  title = ' My Profile';
  isBusy = false;
  constructor() { }

  ngOnInit(): void {
  }

}
