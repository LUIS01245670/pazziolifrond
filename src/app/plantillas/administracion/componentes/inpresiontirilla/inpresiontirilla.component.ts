import { Platform } from '@angular/cdk/platform';
import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-inpresiontirilla',
  templateUrl: './inpresiontirilla.component.html',
  styleUrls: ['./inpresiontirilla.component.scss'],
})
export class InpresiontirillaComponent implements OnInit {
  public activado: boolean = false;
  public mensaje: string = 'jbjhbjbh';
  operaciones = [
    {
      nombre: 'Iniciar',
      argumentos: [],
    },
    {
      nombre: 'EstablecerAlineacion',
      argumentos: [1],
    },

    {
      nombre: 'EscribirTexto',
      argumentos: ['Hola Angular desde parzibyte.me'],
    },
    {
      nombre: 'Feed',
      argumentos: [1],
    },
    {
      nombre: 'EscribirTexto',
      argumentos: [this.mensaje],
    },
    {
      nombre: 'Feed',
      argumentos: [1],
    },
    {
      nombre: 'DescargarImagenDeInternetEImprimir',
      argumentos: ['https://github.com/parzibyte.png', 380, 0, true],
    },
  ];
  constructor(
    private bluetooth: BluetoothSerial,
    private platform: Platform,
    private alertController: AlertController
  ) {
    this.checkBluetooth();
  }

  checkBluetooth() {
    this.bluetooth
      .isEnabled()
      .then(async () => {
        console.log('Bluetooth está encendido');
        this.activado = true;
        const alert = await this.alertController.create({
          message: 'Bluetooth está encendido',
          buttons: ['OK'],
        });

        await alert.present();
        this.listDevices();
      })
      .catch(async () => {
        console.log('Bluetooth NO está encendido');
        const alert = await this.alertController.create({
          message: 'Bluetooth está encendido',
          buttons: ['OK'],
        });

        await alert.present();
      });
  }

  listDevices() {
    this.bluetooth
      .list()
      .then((devices) => {
        console.log('Dispositivos emparejados:', devices);
      })
      .catch((error) => {
        console.error('Error listando dispositivos:', error);
      });
  }
  ngOnInit(): void {}
}
