import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoisComponent } from './mois.component';

describe('MoisComponent', () => {
  let component: MoisComponent;
  let fixture: ComponentFixture<MoisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
