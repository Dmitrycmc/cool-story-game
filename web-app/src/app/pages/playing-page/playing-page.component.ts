import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { RoomService } from "../../services/room.service";
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Room } from "../../../../../server-app/types/room";
import { parseCookies } from "../../../../../server-app/utils/cookies";
import { Question } from "../../../../../server-app/types/questions-set";
import { setCaretPosition } from "../../../helpers/input";

@Component({
  selector: 'app-playing-page',
  templateUrl: './playing-page.component.html',
  styleUrls: ['./playing-page.component.scss']
})
export class PlayingPageComponent implements OnInit {
  @Input() room?: Room;
  @Input() questions?: Question[];
  @ViewChild('answerRef') answerRef?: ElementRef<HTMLInputElement>;
  answer: string = '';
  caretPos: number = 0;
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

      if (this.isMyTurn) {
        this.answer = this.questions?.[this.room!.currentQuestionNumber!]?.placeholder || '';
        this.caretPos = this.answer.indexOf('^');
        console.log(this.caretPos);
        this.answer = this.answer.replace('^', '');
      }
    }
  }

  onSubmit() {
    this.answer = this.answer.trim();
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

  onFocus() {
    setCaretPosition(this.answerRef!.nativeElement, this.caretPos);
  }
}
