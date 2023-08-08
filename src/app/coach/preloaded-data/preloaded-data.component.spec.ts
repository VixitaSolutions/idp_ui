import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreloadedDataComponent } from './preloaded-data.component';

describe('PreloadedDataComponent', () => {
  let component: PreloadedDataComponent;
  let fixture: ComponentFixture<PreloadedDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreloadedDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreloadedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
