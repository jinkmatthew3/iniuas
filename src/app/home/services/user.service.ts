import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<Location>;
  private locations: Observable<Location[]>;
  userRef: AngularFirestoreCollection<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private fireStorage: AngularFireStorage
  ) { }

  setUserLocation(uid, loc, time) {
    var lat = loc['lat'];
    var lng = loc['lng'];

    var userCollection = this.db.collection("users").doc(uid);

    return userCollection.update({
      lat: lat,
      lng: lng,
      time: time,
      //lastLoc: userHistoryLoc
    })
      .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  }

  addFriend(list,uid) {
    var userCollection = this.db.collection("users").doc(uid);

    return userCollection.update({
      friendList: list 
    })
      .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  }

  checkFriend(email) {

    var cek = this.db.collection("users", ref => ref.where("email", "==", email)).valueChanges();
    return cek;
  }


  getUserData(uid) {
    return this.db.collection("users").doc(uid).valueChanges();
  }

  uploadPhotoprofile(id, foto){
    let ref = this.fireStorage.ref('Users/'+id+'/'+"profile");
      // this.storageRef.child(id).put(foto[0])
    ref.put(foto).then(res=>{
      ref.getDownloadURL().subscribe(url=>{
        console.log(url);
        this.db.collection("users").doc(id).update({storageRef:url});
      });

    }).catch(e=>{
      console.log(e);
    });
  }

  /*updatePhotoProfile(uid, filename) {
    var userCollection = this.db.collection("users").doc(uid);

    return userCollection.update({
      storageRef : filename 
    })
      .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  }*/
}
