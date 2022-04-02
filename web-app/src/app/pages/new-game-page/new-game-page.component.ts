import { Component, OnInit } from '@angular/core';
import { RoomService } from "../../services/room.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { buildInviteText } from "../../../helpers/templates";

@Component({
  selector: 'app-new-game-page',
  templateUrl: './new-game-page.component.html',
  styleUrls: ['./new-game-page.component.scss']
})
export class NewGamePageComponent implements OnInit {
  constructor(private roomService: RoomService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.roomService.createRoom().subscribe(async (room) => {
      await navigator.clipboard.writeText(buildInviteText(room.id!)).then();
      this._snackBar.open("Ссылка на комнату скопирована в буфер обмена")
      await this.router.navigate(['/room', room.id], {replaceUrl: true});
    });
  }

}
