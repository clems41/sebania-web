import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempsTravailComponent } from './temps-travail.component';

describe('TempsTravailComponent', () => {
  let component: TempsTravailComponent;
  let fixture: ComponentFixture<TempsTravailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempsTravailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempsTravailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
