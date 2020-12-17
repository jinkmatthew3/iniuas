import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource, Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userUid: any;
  userName: String;
  user: any;
  isDesktop: boolean;
  object: any;
  img1: any;
  fileName: any;
  imageUrl: any = 'https://i.pinimg.com/474x/bb/5e/8e/bb5e8e449fe4d7f0abb3ab7902dbb63d.jpg';
  
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  
  constructor(
    private authService: AuthService,
    private fireAuth: AngularFireAuth,
    private userService: UserService,
    private platform: Platform,
    private sanitizer: DomSanitizer,
  ) {
    //this.imageUrl ;
    //this.getUserUid();
  }
  
  ngOnInit() {
    this.getUserUid();
    if((this.platform.is('mobile')&& this.platform.is('hybrid'))||this.platform.is('desktop')){
      this.isDesktop = true;
    }
  }

  ionViewWillEnter(){
    //this.getUserUid();
  }

  async getPicture(type: string) {
    if(!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')){
      this.filePickerRef.nativeElement.click();
      return;
    }
    
    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });
    let reader = new FileReader();

    this.object = image.webPath;
    // this.object.src = this.object;
    console.log("object", this.object);
    let blob = await fetch(image.webPath).then(r=>r.blob());
    console.log("blob", blob);
    this.img1 = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.webPath));
    console.log(this.img1);

    this.fileName = blob;
    console.log("fileName", this.fileName);

    //this.userService.updatePhotoProfile(this.userUid, this.fileName);
    this.userService.uploadPhotoprofile(this.userUid, this.fileName);
  }

  async getUserUid()  {
    return new Promise<void>(resolve => {
      this.fireAuth.authState.subscribe( authState => {
        this.userUid = authState.uid;
        console.log(this.userUid);
        this.getUserName();
        resolve();
      })
    })
  }

  getUserName(){
    this.user = this.userService.getUserData(this.userUid);
    this.user.subscribe(items => {
      this.userName = items.named + " " + items.nameb;
      this.img1 = items.storageRef;
      console.log(this.img1);
      console.log(this.userName);
    })
    //console.log(this.user);  
  }

  logout() {
    this.authService.logoutUser();
  }
}
