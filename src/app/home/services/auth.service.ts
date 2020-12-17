import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import firebase from 'firebase';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<User>;
  private users: Observable<User[]>;

  constructor(
      private afAuth: AngularFireAuth,
      private db: AngularFirestore
  ) {
    this.userCollection = db.collection<User> ('users');
    this.users = this.userCollection.snapshotChanges().pipe(
        map (actions => {
          return actions.map (a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ... data};
          });
        })
    );
  }

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {

      this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
          .then(
              res => {
                console.log('User id after reigstration = ' + res.user.uid);
                const user: User = {
                  id: res.user.uid,
                  named: value.named,
                  nameb: value.nameb,
                  email: value.email
                };
                this.userCollection.doc(res.user.uid).set(user);
                resolve(res);
              }, err => {
                reject(err);
              }
          );
    });

  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password)
          .then(
              res => resolve(res),
              err => reject(err));
    });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth.signOut()
            .then(() => {
              console.log('LOG Out');
              resolve();
            }).catch((error) => {
          reject();
        });
      }
    });
  }

  userDetails() {
    // console.log('afAuth.user : ' + this.afAuth);
    return this.afAuth.user;
  }

  getCurrentUser() {
    if (firebase.auth().currentUser) {
       return firebase.auth().currentUser;
    } else {
       return null;
    }
  }
}
