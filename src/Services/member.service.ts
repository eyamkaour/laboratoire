import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Member } from 'src/Models/Membre';

// le service accépté d'etre invoiquer par autre compsant
@Injectable({
  //accsible pour tout projet
  providedIn: 'root'
})
export class MemberService {
  //CLAsse predefinit de angular qui permet d'envoyer des requettes

  constructor(
    private httpClinet: HttpClient
  ) {
   
   }
   //le sevice et subscriber en reel zny c'est tableux de members
  // 1le html demande donne de service
   //2 sevice envoi requete au base (ligne 15)
   //3)le serveur envoi les donnees (ligne 15)
   //4) le service envoi au comosant member

  GetAllMembers():Observable<Member []>{
    //envoi d'une requette http vers le backend 
    return  this.httpClinet.get< Member []>("http://localhost:3000/membres")
  }
  //lorsque appele methode de service lance un thread de type observable
  //retorn status dans post
  addMember(x:Member){
    return this.httpClinet.post<void>
    ('http://localhost:3000/membres',x)

  }
  //l'id genere random par json server
  deleteMemberById (id : string){
    return this.httpClinet.delete<void>(`http://localhost:3000/membres/${id}`)
  }
  getMemberById(id : string):Observable<Member>{
    console.log("sevice get")
    return this.httpClinet.get< Member>(`http://localhost:3000/membres/${id}`)
  }
  updateMmber(id : string , member : Member){
    return this.httpClinet.put< void>(`http://localhost:3000/membres/${id}`, member)// PUT ECRASE LE DONNES PRECEDENT ET met le nouveaux (modification)
  }
}
