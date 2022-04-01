import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { RoomService } from "../../services/room.service";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Room } from "../../../../../server-app/types/room";
import { Status } from "../../../../../server-app/types/status";
import { parseCookies } from "../../../../../server-app/utils/cookies";

@Component({
  selector: 'app-story-page',
  templateUrl: './story-page.component.html',
  styleUrls: ['./story-page.component.scss']
})
export class StoryPageComponent implements OnInit {
  @Input() room?: Room;
  roomId = this.activatedRoute.snapshot.params['roomId'];
  pending = false;
  myIndex?: number;
  story: string = '';

  constructor(
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('room' in changes) {
      this.myIndex = this.room?.players.findIndex(p => p.id === parseCookies(document.cookie)[`player-id:${this.roomId}`]);

      if (this.room?.status === Status.FINISHED && this.room!.currentPlayerNumber! >= this.myIndex!) {
        this.pending = true;
        this.roomService.getStory(this.roomId).subscribe(answers => {
          this.pending = false;
          this.story = answers.join(' ');
        });
      }
    }
  }

  pubStory() {
    this.pending = true;
    this.roomService.publishStory(this.roomId).subscribe({
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
