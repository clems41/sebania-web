import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelleDialogComponent } from './parcelle-dialog.component';

describe('EmployeDialogComponent', () => {
  let component: ParcelleDialogComponent;
  let fixture: ComponentFixture<ParcelleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
