import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {
  updateEvent(data: any, id :string) {
    return this.httpClinet.put< void>(`http://localhost:3000/events/${id}`,data)// PUT ECRASE LE DONNES PRECEDENT ET met le nouveaux (modification)
  }
  getEventById(data: any):Observable<any> {
    console.log("sevice get")
           return this.httpClinet.get< any>(`http://localhost:3000/events/${data}`)
  }

  constructor( private httpClinet: HttpClient ) {
       
   }
   GetAllEventes():Observable<Event []>{
       //envoi d'une requette http vers le backend 
       return  this.httpClinet.get< Event []>("http://localhost:3000/events")
     }
     addEvent(x:Event){
         return this.httpClinet.post<void>
         ('http://localhost:3000/events',x)
     
       }
         
}
