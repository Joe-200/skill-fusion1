import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillFusionPlatform } from './skill-fusion-platform';

describe('SkillFusionPlatform', () => {
  let component: SkillFusionPlatform;
  let fixture: ComponentFixture<SkillFusionPlatform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillFusionPlatform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillFusionPlatform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
