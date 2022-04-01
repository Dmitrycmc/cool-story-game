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
    const wsProtocol = `ws${production ? 's' : ''}`;

    const ws = webSocket(
      `${wsProtocol}://${window.location.host}/api/web-socket`
    );

    toggleButtonEvent?.subscribe((msg: any) => {
      ws.next({ ...msg, roomId });
    });

    return new Observable<any>(subscriber => {
      ws.subscribe(msg => subscriber.next(msg));
    });
  }
}
