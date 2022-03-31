import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { webSocket } from "rxjs/webSocket";
import { environment } from "../../environments/environment";

const production = environment.production;

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  constructor() { }

  public openWebSocket(roomId: string, toggleButtonEvent?: Observable<any>): Observable<any> {
    const ws = webSocket(
      `ws${production ? 's' : ''}://${window.location.host}/api/web-socket`
    );
    toggleButtonEvent?.subscribe((msg: any) => {
      ws.next({
        ...msg,
        roomId
      });
    });

    return new Observable<any>(subscriber => {
      ws.subscribe((msg: any) => {
        if (msg.type !== 'NEW_PLAYER') {
          return;
        }
        return subscriber.next(msg.name)
      });
    });
  }
}
