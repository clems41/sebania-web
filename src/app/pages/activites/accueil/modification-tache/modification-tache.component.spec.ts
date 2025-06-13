import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationTacheComponent } from './modification-tache.component';

describe('ModificationTacheComponent', () => {
  let component: ModificationTacheComponent;
  let fixture: ComponentFixture<ModificationTacheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificationTacheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificationTacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
