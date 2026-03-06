import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateHistory } from './candidate-history';

describe('CandidateHistory', () => {
  let component: CandidateHistory;
  let fixture: ComponentFixture<CandidateHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
