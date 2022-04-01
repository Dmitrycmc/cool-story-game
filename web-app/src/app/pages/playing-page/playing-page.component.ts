import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { RoomService } from "../../services/room.service";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Room } from "../../../../../server-app/types/room";
import { parseCookies } from "../../../../../server-app/utils/cookies";

@Component({
  selector: 'app-playing-page',
  templateUrl: './playing-page.component.html',
  styleUrls: ['./playing-page.component.scss']
})
export class PlayingPageComponent implements OnInit {
  @Input() room?: Room;
  @Input() questions?: string[];
  answer: string = '';
  pending = false;
  isMyTurn = false;
  roomId = this.activatedRoute.snapshot.params['roomId'];

  constructor(
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('room' in changes) {
      this.isMyTurn =
        this.room!.players[this.room!.currentPlayerNumber!].id ===
        parseCookies(document.cookie)[`player-id:${this.roomId}`];
    }
  }

  onSubmit() {
    if (!this.answer?.length) {
      return;
    }
    this.pending = true;
    this.roomService.answer(this.roomId, this.answer).subscribe({
      next: () => {
        this.pending = false;
        this.answer = '';
      },
      error: (error) => {
        this.pending = false;
        this._snackBar.open(error.error);
      }
    });
  }
}
