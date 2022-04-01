import { Component, OnInit } from "@angular/core";
import { RoomService } from "../../services/room.service";
import { ActivatedRoute } from "@angular/router";
import { Room } from "../../../../../server-app/types/room";
import { from } from "rxjs";
import { PlayersService } from "../../services/players.service";
import { Status } from "../../../../../server-app/types/status";

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  room?: Room;
  questions?: string[];
  roomId = this.activatedRoute.snapshot.params['roomId'];
  pending = false;

  constructor(
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private playersService: PlayersService
  ) { }

  ngOnInit(): void {
    this.pending = true;
    this.roomService.statusRoom(this.roomId).subscribe(room => {
      this.room = room;
      this.roomService.getQuestions(room.questionsSetId).subscribe(questions => {
        this.questions = questions.questions;
        this.pending = false;
      });
    });

    this.playersService.openWebSocket(this.roomId, from([{type: 'JOIN'}]))
      .subscribe(msg => {
        switch (msg.type) {
          case 'NEW_PLAYER':
            this.room = {
              ...this.room!,
              players: [
                ...this.room?.players || [],
                msg.payload
              ]
            };
            return;
          case 'START':
            this.room = {
              ...this.room!,
              status: Status.GAME,
              turn: 0,
              currentPlayerNumber: 0,
              currentQuestionNumber: 0
            };
            return;
          case 'TURN':
            this.room = msg.payload;
            return;
        }
      });
  }
}
