import { Component, OnInit } from '@angular/core';
import { parseCookies } from "../../../../../server-app/utils/cookies";
import { RoomService } from "../../services/room.service";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-playing-page',
  templateUrl: './playing-page.component.html',
  styleUrls: ['./playing-page.component.scss']
})
export class PlayingPageComponent implements OnInit {
  answer: string = '';
  pending = false;
  roomId = this.activatedRoute.snapshot.params['roomId'];

  constructor(
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {}

  onSubmit() {
    if (!this.answer?.length) {
      return;
    }
    this.pending = true;
    this.roomService.answer(this.roomId, this.answer).subscribe({
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
