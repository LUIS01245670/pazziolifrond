import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemspedidoComponent } from './itemspedido.component';

describe('ItemspedidoComponent', () => {
  let component: ItemspedidoComponent;
  let fixture: ComponentFixture<ItemspedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemspedidoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemspedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
