import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachSummaryComponent } from './coach-summary.component';

describe('CoachSummaryComponent', () => {
  let component: CoachSummaryComponent;
  let fixture: ComponentFixture<CoachSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
