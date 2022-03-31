import { Component, OnInit } from '@angular/core';
import { RoomService } from "../../services/room.service";
import { ActivatedRoute } from "@angular/router";
import { Room } from "../../../../../server-app/types/room";
import { parseCookies } from "../../../../../server-app/utils/cookies";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  name: string | null = localStorage.getItem('name');
  room?: Room;
  roomId = this.activatedRoute.snapshot.params['roomId'];
  pending = false;
  registered = Boolean(parseCookies(document.cookie)?.[`player:${this.roomId}`]);

  constructor(
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.pending = true;
    this.roomService.statusRoom(this.roomId).subscribe(room => {
      this.room = room;
      this.pending = false;
    });
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
}
