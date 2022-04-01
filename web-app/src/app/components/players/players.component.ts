import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
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
  @Input() players: Partial<Player>[] = [];

  constructor(private playersService: PlayersService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {}

  displayedColumns = ['Игрок', '1', '2', '3'];

  tableCell = this.displayedColumns.reduce((acc, col) => ({
    ...acc,
    [col]: false
  }), {});

  buildTableCell = (p: Partial<Player>) => ({...this.tableCell, [this.displayedColumns[0]]: p.name});

  dataSource: {}[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if ('players' in changes) {
      this.dataSource = this.players.map(this.buildTableCell);
    }
  }
}
