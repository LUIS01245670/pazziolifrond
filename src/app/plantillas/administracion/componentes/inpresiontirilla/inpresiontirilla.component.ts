import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';
declare var BTPrinter: any;
@Component({
  selector: 'app-inpresiontirilla',
  templateUrl: './inpresiontirilla.component.html',
  styleUrls: ['./inpresiontirilla.component.scss'],
})
export class InpresiontirillaComponent implements OnInit {
  public activado: boolean = false;

  constructor(
    private platform: Platform,
    private alertController: AlertController
  ) {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.activado = true;
      this.listPrinters(); // Listar impresoras solo en móvil
    } else {
      this.activado = false;
      alert(
        'Funcionalidad de impresión solo disponible en dispositivos móviles'
      );
    }
  }

  listPrinters() {
    BTPrinter.list(
      (printers: any) => {
        alert('Impresoras encontradas:');
        alert('Impresoras encontradas: ' + JSON.stringify(printers));
      },
      (err: any) => {
        alert('Error al listar impresoras');
      }
    );
  }
  ngOnInit(): void {}
}
