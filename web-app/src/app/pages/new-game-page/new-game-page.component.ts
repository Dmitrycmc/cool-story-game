import { Component, OnInit } from '@angular/core';
import { RoomService } from "../../services/room.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-new-game-page',
  templateUrl: './new-game-page.component.html',
  styleUrls: ['./new-game-page.component.scss']
})
export class NewGamePageComponent implements OnInit {
  constructor(private roomService: RoomService, private router: Router) { }

  ngOnInit(): void {
    this.roomService.createRoom().subscribe(room => {
      this.router.navigate(['/room', room.id], {replaceUrl: true});
    });
  }

}
