import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InpresiontirillaComponent } from './inpresiontirilla.component';

describe('InpresiontirillaComponent', () => {
  let component: InpresiontirillaComponent;
  let fixture: ComponentFixture<InpresiontirillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InpresiontirillaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InpresiontirillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
