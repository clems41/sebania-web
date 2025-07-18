import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardActiviteComponent } from './card-activite.component';

describe('CardActiviteComponent', () => {
  let component: CardActiviteComponent;
  let fixture: ComponentFixture<CardActiviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardActiviteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardActiviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
