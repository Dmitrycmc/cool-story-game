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

  constructor(
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.name?.length) {
      return;
    }
    this.pending = true;
    this.roomService.register(this.roomId, this.name).subscribe({
      next: () => {
        this.pending = false;
        this.registered = true;
        if (!localStorage.getItem('name')) {
          localStorage.setItem('name', this.name!);
        }
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