import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptService {
  passwordFromUI: string = '';
  constructor() {
    this.resetPassword();
  }

  resetPassword() {
    if (!localStorage.getItem('eA20')) {
      this.passwordFromUI = Math.random().toString(36).slice(-10);
      // 			localStorage.setItem("eA20", this.passwordFromUI)
    }
  }

  encrypt(data: string, name: string) {
    let eA20 = localStorage.getItem('eA20');
    // let _key = eA20;
    let _iv = CryptoJS.enc.Utf8.parse(eA20 ? eA20 : '');
    let encrypted = CryptoJS.AES.encrypt(data, eA20 ? eA20 : '');
    localStorage.setItem(name, encrypted.toString());
  }

  decrypt(name: any) {
    if (localStorage.getItem(name)) {
      let data = localStorage.getItem(name);
      let eA20 = localStorage.getItem('eA20');
      // let _key = eA20;
      let _iv = CryptoJS.enc.Utf8.parse(eA20 ? eA20 : '');
      let _decrypted = CryptoJS.AES.decrypt(data ? data : '', eA20 ? eA20 : '');
      return _decrypted.toString(CryptoJS.enc.Utf8);
    } else {
      return false;
    }
  }
}
