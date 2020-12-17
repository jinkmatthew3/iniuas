import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Plugins } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

const { Geolocation } = Plugins;
declare var google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage {
  locations: Observable<any>;
  locationsCollection: AngularFirestoreCollection<any>;
  isCheckIn: boolean = false;
  

  async ionViewWillEnter() {
    this.showMap();
  }

  @ViewChild('map', { read: ElementRef, static: false }) mapRef: ElementRef;
  map: any;
  markers = [];
  userLoc = { lat: 0, lng: 0}
  locName: string;
  userId: string;
  userHistoryLoc: Array<any> = [];

  constructor(
    private afs: AngularFirestore,
    private toastController: ToastController,
    private userService: UserService,
    private authService: AuthService
  ) {
    //doSomething();
    this.getCurrentLocation();
    console.log(this.authService.getCurrentUser().uid);
    this.userId = this.authService.getCurrentUser().uid;
  }

  async getCurrentLocation(){
    var myLat;
    var myLong;
    console.log("masuk pak eko");

    Geolocation.getCurrentPosition().then((resp) => {

      myLat = resp.coords.latitude;
      myLong = resp.coords.longitude;
      console.log(myLat + " " + myLong);
      this.userLoc.lat = myLat;
      this.userLoc.lng = myLong;
      console.log(this.userLoc.lat + " " + this.userLoc.lng);
    }).catch((error) => {
      console.log('Error getting location', error);
    })
}

  showMap() {
    //this.getCurrentLocation();
    const options = {
      center: new google.maps.LatLng(this.userLoc.lat, this.userLoc.lng),
      zoom: 15,
      disableDefaultUI: true
    };

    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    const marker = new google.maps.Marker({
      position: this.userLoc,
      map: this.map
    });
  }

  addCheckin() {
    var currentTime = new Date();
    var tempLoc = new Array<any>();
    /*tempLoc = [
      {
        lat: this.userLoc.lat,
        lng: this.userLoc.lng,
        time: currentTime,
        locName: this.locName
      }
    ]*/
    //this.userHistoryLoc.push(tempLoc);
    this.userService.setUserLocation(this.userId ,this.userLoc, currentTime);
    //this.userService.updateCheckinList(this.userUid, this.locName, currentTime, "add");
    this.presentToast("Check in added.","success");
    //this.locName = "";
    this.toggleCheckIn();
  }

  getUserLastUpdate() {
    return new Promise((resolve, reject) => {
      /*this.userService.getUserData(this.userUid).subscribe(data => {
        if(data['lastTime'] != null) resolve(parseInt(data['lastTime']));
        resolve(0);
      });*/
    });
  }

  toggleCheckIn(){
    this.isCheckIn = !this.isCheckIn;
  }

  centerMap() {
    this.map.setCenter(this.userLoc);
    //this.showMap();
  }

  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 1000,
    });
    toast.present();
  }
}
