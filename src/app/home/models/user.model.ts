import { IonDatetime } from '@ionic/angular';

export interface User {
  id?: string;
  named: string;
  nameb: string;
  email: string;
}

export interface Location {
  id?: string;
  lat: string;
  lng: string;
  time: IonDatetime;
  userId: string;
}