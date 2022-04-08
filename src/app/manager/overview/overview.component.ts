import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/home/home.component';
import { ClientService } from 'src/app/_services/client.service';

@Component({
  selector: 'app-manager-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
    @ViewChild('menuView') room1: TemplateRef<any>;
    @Input() menus: Menu[];
    @Output() component = new EventEmitter<string>();
    constructor(private clientService: ClientService, private router: Router) { }

    ngOnInit(): void {
      this.clientService.getManagerMenus().subscribe((data: Menu[]) => {
        console.log(data);
        this.menus = data.filter(i => i.name.toLowerCase() !== 'home');
      });
    }
    goTo(url): void {
      this.router.navigateByUrl(`manager/${url}`);
    }

}
