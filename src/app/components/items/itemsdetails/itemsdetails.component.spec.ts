import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PecasdetailsComponent } from './itemsdetails.component';

describe('PecasdetailsComponent', () => {
  let component: PecasdetailsComponent;
  let fixture: ComponentFixture<PecasdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PecasdetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PecasdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
