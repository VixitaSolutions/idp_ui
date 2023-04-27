import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyidpComponent } from './myidp.component';

describe('MyidpComponent', () => {
  let component: MyidpComponent;
  let fixture: ComponentFixture<MyidpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyidpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyidpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
