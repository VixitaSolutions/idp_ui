import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePreloadeddataComponent } from './manage-preloadeddata.component';

describe('ManagePreloadeddataComponent', () => {
  let component: ManagePreloadeddataComponent;
  let fixture: ComponentFixture<ManagePreloadeddataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePreloadeddataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePreloadeddataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
