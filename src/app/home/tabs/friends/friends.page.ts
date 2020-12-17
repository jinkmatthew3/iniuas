import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  friendName: string;
  userId: string;
  friendList: Array<string> = [];
  user: any;
  userTemp: any;

  friends: Array<any> = [];

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    console.log(this.authService.getCurrentUser().uid);
    this.userId = this.authService.getCurrentUser().uid;
    this.getFriendList();
  }

  ngOnInit() {


  }

  addFriend() {
    console.log(this.friendName);
    let idFriend: any;
    idFriend = this.userService.checkFriend(this.friendName);
    idFriend.subscribe(items => {
      if (items.length != 0) {
        console.log(items[0].id);
        this.friendList.push(items[0].id);
        this.userService.addFriend(this.friendList, this.userId);
      }
    })
  }

  getFriendList() {
    this.user = this.userService.getUserData(this.userId);
    this.user.subscribe(items => {
      items.friendList.forEach(element => {
        console.log(element);
        this.getFriendsListDetail(element);
        this.friendList.push(element);
      });
    })
  }

  getFriendsListDetail(element) {
    var temp = this.userService.getUserData(element);
    temp.subscribe(items => {
      this.friends.push(items);
    })
  }
}
