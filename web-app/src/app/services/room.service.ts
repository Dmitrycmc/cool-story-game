import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Room } from "../../../../server-app/types/room";
import { Player } from "../../../../server-app/types/player";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  public createRoom(): Observable<Room> {
    return this.http.post<Room>('/api/v1/room/new', null);
  }

  public statusRoom(roomId: string): Observable<Room> {
    return this.http.post<Room>(`/api/v1/room/${roomId}/status`, null);
  }

  public register(roomId: string, name: string): Observable<Player> {
    return this.http.post<Player>(`/api/v1/room/${roomId}/register`, {name});
  }
}
