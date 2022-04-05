import { Component, OnInit } from '@angular/core';
import { parseCookies } from "../../../../../server-app/utils/cookies";
import { RoomService } from "../../services/room.service";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit {
  name: string = localStorage.getItem('name') || '';
  pending = false;
  roomId = this.activatedRoute.snapshot.params['roomId'];
  registered = Boolean(parseCookies(document.cookie)?.[`player-id:${this.roomId}`]);
  isRoomAdmin = Boolean(parseCookies(document.cookie)?.[`room-token:${this.roomId}`]);
  notificationsPermission = Notification.permission;

  constructor(
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  async checkNotificationsPermission() {
    if (this.notificationsPermission !== "granted") {
      await Notification.requestPermission();
      this.notificationsPermission = Notification.permission;
    }
  }

  ngOnInit(): void {
    this.checkNotificationsPermission();
  }

  onSubmit() {
    this.name = this.name.trim();
    if (!this.name?.length) {
      return;
    }
    this.pending = true;
    this.roomService.register(this.roomId, this.name).subscribe({
      next: () => {
        this.pending = false;
        this.registered = true;
        localStorage.setItem('name', this.name!);
      },
      error: (error) => {
        this.pending = false;
        this._snackBar.open(error.error);
      }
    });
  }


  onStart() {
    this.pending = true;
    this.roomService.start(this.roomId).subscribe({
      next: () => {
        this.pending = false;


      },
      error: (error) => {
        this.pending = false;
        this._snackBar.open(error.error);
      }
    });
  }
}
