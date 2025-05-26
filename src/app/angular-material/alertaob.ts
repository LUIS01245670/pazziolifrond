import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

/**
 * @description Interfaz del dialog alerta
 */
export interface DatosAlertaob {
  /**
   * @description Tipo de alert a mostrar, recibe 5 valores 'done', 'warning', 'info', 'error' y 'question', (string) (obligatorio)
   */
  tipo?: string;
  /**
   * @description Titulo del alert, (string) (obligatorio)
   */
  titulo: string;
  /**
   * @description TContenido del alert, (string) (obligatorio)
   */
  mensaje?: string;
  /**
   * @description Texto que aparecerá en en el primer botón del dialog, (string) (obligatorio)
   */
  boton: string;
  /**
   * @description Texto que aparecerá en en el segundo botón del dialog, (opcional)
   */
  boton1?: string;
  /**
   * @description Valida si el alert lleva un input
   */
  input: boolean;
  /**
   * @description Valida el tipo de input en el alert, 'number', 'password', 'email', 'text' : default 'number'
   */
  type?: string;
  /**
   * @description Valor inicial del input
   */
  valorInicialInput?: number;
  /**
   * @description Icono del input, mira los nombres en https://material.io/resources/icons/ : default 'credit_card'
   */
  inputIcon?: string;
  /**
   * @description Titulo del input : default 'Total a ingresar'
   */
  inputText?: string;

  boton2?: any;
  boton3?: string;
}

@Component({
  selector: 'dialogo-alerta',
  template: `
    <div class="contenedor-alert">
      <mat-icon class="icono-alert" [color]="color" style="height: auto;">{{
        icono
      }}</mat-icon>
      <h1 mat-dialog-title class="titulo-alert" *ngIf="titulo">{{ titulo }}</h1>
      <p>{{ mensaje }}</p>
      <div class="row" [hidden]="!input">
        <div class="col-md-12">
          <mat-form-field appearance="fill" rounded>
            <mat-label>{{ inputText }}</mat-label>
            <textarea
              matInput
              [type]="type"
              id="Valor"
              [cdkTextareaAutosize]="true"
              [cdkAutosizeMaxRows]="12"
              [cdkAutosizeMinRows]="5"
              [formControl]="valorInput"
            ></textarea>
            <mat-icon matSuffix>{{ inputIcon }}</mat-icon>
          </mat-form-field>
        </div>
      </div>
      <div
        mat-dialog-actions
        class="botones-alert"
        style="justify-content: center;"
      >
        <button
          [hidden]="ocultarBoton1"
          mat-button
          color="basic"
          [mat-dialog-close]="false"
        >
          {{ boton1 }}
        </button>
        <button
          [hidden]="ocultarBoton"
          mat-flat-button
          [color]="color"
          [disabled]="!valorInput.valid && input"
          [mat-dialog-close]="valorInput.value || true"
        >
          {{ boton }}
        </button>
      </div>
    </div>
  `,
})
export class DialogoAlertaob {
  titulo: string;
  mensaje: any;
  color: string = '';
  boton1: any;
  boton: string;
  icono: string = '';
  ocultarBoton1: boolean = false;
  ocultarBoton: boolean = false;

  input: boolean;
  type: string = 'number';
  inputIcon: string = '';
  inputText: string = 'Total a ingresar';
  valorInput: UntypedFormControl;

  private domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
  constructor(
    public dialogRef: MatDialogRef<DialogoAlertaob>,
    @Inject(MAT_DIALOG_DATA) public data: DatosAlertaob
  ) {
    this.valorInput = new UntypedFormControl('');

    this.titulo = data.titulo;
    this.mensaje = data.mensaje;
    this.boton1 = data.boton1;
    this.boton = data.boton;
    this.input = data.input;
    if (data.type) {
      this.type = data.type;
    }
    if (data.inputIcon) {
      this.inputIcon = data.inputIcon;
    }
    if (data.inputText) {
      this.inputText = data.inputText;
    }

    this.valorInput.setValue(data.valorInicialInput);

    if (data.boton) {
      this.ocultarBoton = false;
    } else {
      this.ocultarBoton = true;
    }

    if (data.boton1) {
      this.ocultarBoton1 = false;
    } else {
      this.ocultarBoton1 = true;
    }

    if (data.tipo) {
      if (data.tipo === 'error') {
        this.icono = 'error';
        this.color = 'warn';
      } else if (data.tipo === 'done') {
        this.icono = 'check_circle';
        this.color = 'primary';
      } else if (data.tipo === 'question') {
        this.icono = 'help';
        this.color = 'accent';
      } else if (data.tipo === 'info') {
        this.icono = 'info';
        this.color = 'primary';
      } else if (data.tipo === 'warning') {
        this.icono = 'warning';
        this.color = 'warn';
      } else {
        this.icono = 'error';
        this.color = 'warn';
        this.titulo = 'ERROR DE ALERTA';
        this.mensaje =
          "El parametro tipo sólo recibe 5 valores de tipo String 'done', 'warning', 'info', 'error' y 'question' por favor envíe un valor válido.";
        this.boton = 'cerrar';
      }
    } else {
      this.color = 'primary';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.ocultarBoton1 = true;
  }
}
