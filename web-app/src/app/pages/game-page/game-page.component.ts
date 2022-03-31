import { Component, OnInit } from '@angular/core';
import { RoomService } from "../../services/room.service";
import { ActivatedRoute } from "@angular/router";
import { Room } from "../../../../../server-app/types/room";
import { parseCookies } from "../../../../../server-app/utils/cookies";

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {

  name?: string;
  room?: Room;
  roomId = this.activatedRoute.snapshot.params['roomId'];
  pending = false;
  registered = Boolean(parseCookies(document.cookie)?.[`player:${this.roomId}`]);

  constructor(private roomService: RoomService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.pending = true;
    this.roomService.statusRoom(this.roomId).subscribe(room => {
      this.room = room;
      this.pending = false;
    });
  }

  onSubmit() {
    this.pending = true;
    this.roomService.register(this.roomId, this.name!).subscribe(() => {
      this.pending = false;
      this.registered = true;
    });
  }

}
