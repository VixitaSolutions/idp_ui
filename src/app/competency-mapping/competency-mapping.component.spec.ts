import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyMappingComponent } from './competency-mapping.component';

describe('CompetencyMappingComponent', () => {
  let component: CompetencyMappingComponent;
  let fixture: ComponentFixture<CompetencyMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetencyMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
