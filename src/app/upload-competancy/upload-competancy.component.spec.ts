import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCompetancyComponent } from './upload-competancy.component';

describe('UploadCompetancyComponent', () => {
  let component: UploadCompetancyComponent;
  let fixture: ComponentFixture<UploadCompetancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCompetancyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCompetancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
