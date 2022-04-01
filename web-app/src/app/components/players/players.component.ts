import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { PlayersService } from "../../services/players.service";
import { ActivatedRoute } from "@angular/router";
import { Player } from "../../../../../server-app/types/player";
import { Room } from "../../../../../server-app/types/room";
import { parseCookies } from "../../../../../server-app/utils/cookies";

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
  @Input() room?: Room;
  roomId = this.activatedRoute.snapshot.params['roomId'];
  myIndex?: number;

  constructor(
    private playersService: PlayersService,
    private activatedRoute: ActivatedRoute
  ) { }

  displayedColumns: string[] = [];
  dataSource: {}[] = [];

  ngOnInit() {
  }

  buildTableCell = (p: Partial<Player>, i: number) => ({
    ...this.displayedColumns.reduce((acc, col, j) =>
      ({
        ...acc,
        [col]: this.room!.turn! - ((j - 1) * this.room!.questionsNumber! + i)
      }), {}),
    [this.displayedColumns[0]]: p.name
  });

  ngOnChanges(changes: SimpleChanges) {
    if ('room' in changes) {
      if (!this.displayedColumns.length) {
        this.displayedColumns = ['Игрок', ...Object.keys([...new Array(this.room!.questionsNumber)])];
      }
      this.dataSource = this.room!.players.map(this.buildTableCell);
      this.myIndex = this.room?.players.findIndex(p => p.id === parseCookies(document.cookie)[`player-id:${this.roomId}`]);
    }
  }
}
