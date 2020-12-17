import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private formBuilder: FormBuilder

  ) { }

  validationForm: FormGroup;
  errorMessage = '';

  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  ngOnInit() {

    this.validationForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  loginUser(value) {
    this.authService.loginUser(value)
      .then(res => {
        console.log(res);
        this.errorMessage = '';
        this.navCtrl.navigateForward('/home/tabs/maps');
        // if (res.user) {
        //   this.user.setUser({
        //     value.email,
        //     uid: res.user.uid
        //   });
        //   this.navCtrl.navigateForward('/home');
        // }
      }, err => {
        console.dir(err);
        if (err.code === 'auth/user-not-found') {
          console.log('User not found');
        }
        this.errorMessage = err.message;
      });
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('/home/register');
  }
}