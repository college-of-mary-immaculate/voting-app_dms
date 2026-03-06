import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCandidates } from './manage-candidates';

describe('ManageCandidates', () => {
  let component: ManageCandidates;
  let fixture: ComponentFixture<ManageCandidates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageCandidates],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageCandidates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
