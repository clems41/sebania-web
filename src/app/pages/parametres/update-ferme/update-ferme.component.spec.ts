import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFermeComponent } from './update-ferme.component';

describe('UpdateFermeComponent', () => {
  let component: UpdateFermeComponent;
  let fixture: ComponentFixture<UpdateFermeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFermeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFermeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
