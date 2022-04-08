import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../home/home.component';
import { ClientService } from '../_services/client.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  @Input() menus: Menu[];
  @Output() component = new EventEmitter<string>();
  constructor(private clientService: ClientService, private router: Router) { }

  ngOnInit(): void {
    this.clientService.getMenus().subscribe(data => {
      // this.menus = data;
      this.menus = data.filter(i => i.name !== 'Home');
    });
  }
  goTo(url): void {
    this.router.navigateByUrl(`admin/${url}`);
    // this.component.emit(name);
  }

}
