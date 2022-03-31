import { Component, Input, OnInit } from "@angular/core";
import { PlayersService } from "../../services/players.service";
import { ActivatedRoute } from "@angular/router";
import { from } from "rxjs";
import { Player } from "../../../../../server-app/types/player";

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
  @Input() players?: Partial<Player>[] = [];

  constructor(private playersService: PlayersService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const roomId = this.activatedRoute.snapshot.params['roomId'];

    this.playersService.openWebSocket(roomId, from([{type: 'JOIN'}])).subscribe(name => {
      this.players?.push({name});
    });
  }

}
