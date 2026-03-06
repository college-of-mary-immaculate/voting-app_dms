import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vote } from './vote';

describe('Vote', () => {
  let component: Vote;
  let fixture: ComponentFixture<Vote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Vote],
    }).compileComponents();

    fixture = TestBed.createComponent(Vote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
