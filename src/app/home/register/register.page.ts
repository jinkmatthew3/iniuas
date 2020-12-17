import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  regisForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  constructor(
      private navCtrl: NavController,
      private authService: AuthService,
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.regisForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      named: new FormControl('', Validators.compose([
        Validators.required
      ])),
      nameb: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  tryRegister(value) {
    this.authService.registerUser(value)
        .then(res => {
          console.log(res);
          // this.errorMessage = '';
          // this.successMessage = 'Your account has been created. Please log in.';
          this.authService.loginUser(value).then(() => {
            this.navCtrl.navigateForward('/home');
          });
        }, err => {
          console.log(err);
          this.errorMessage = err.message;
          this.successMessage = '';
        });
  }

  goLoginPage() {
    this.navCtrl.navigateBack('/login');
  }

}
