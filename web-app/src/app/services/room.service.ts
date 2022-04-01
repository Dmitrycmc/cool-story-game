import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Room } from "../../../../server-app/types/room";
import { Player } from "../../../../server-app/types/player";
import { QuestionsSet } from "../../../../server-app/types/questions-set";

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

  public getQuestions(questionsId: string): Observable<QuestionsSet> {
    return this.http.get<QuestionsSet>(`/api/v1/questions/${questionsId}`);
  }

  public register(roomId: string, name: string): Observable<Player> {
    return this.http.post<Player>(`/api/v1/room/${roomId}/register`, {name});
  }

  public start(roomId: string): Observable<Room> {
    return this.http.post<Room>(`/api/v1/room/${roomId}/start`, null);
  }

  public answer(roomId: string, answer: string): Observable<Room> {
    return this.http.post<Room>(`/api/v1/room/${roomId}/answer`, {answer});
  }

  public getStory(roomId: string): Observable<string[]> {
    return this.http.post<string[]>(`/api/v1/room/${roomId}/story`, null);
  }

  public publishStory(roomId: string): Observable<Room> {
    return this.http.post<Room>(`/api/v1/room/${roomId}/publish`, null);
  }
}
