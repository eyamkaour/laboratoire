import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { MemberService } from 'src/Services/member.service';
import { Member } from 'src/Models/Membre';
import {MatButtonModule} from '@angular/material/button';
import { DataSource } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent {
dataSource: Member[]=[

]
//injecte dependance netre : permet d'injection (utilsateur)des service dans un composant
//un sevice dans un composant ou dans autre composant
//en engular le nom avant le type
//consiste à creer uà cree une instance privé de service dans compsant (doit éy=tre privé non oublic)
//dans le service dois aaccepte d'étre accépté
//on peux injexter le service si le service ne contient âs le decorateur @injectable (le service doit accépte se injection)
constructor(private MS:MemberService,private dialog:MatDialog){

}
//lance automattiqueemnt plusa rapide que constructeur dans executions
fetch(){
   this.MS.GetAllMembers().subscribe((x)=>{
    this.dataSource=x;
  });
}
ngOnInit(){
  //x tableaux de membre  lem meem type avec backend
  //en declare meembre comme subscriber
  //{} on execute aprés recupére x dans code interne awaite atend le x apres la recuperation faire cette action
  //x varraible local dans visible par exetreieur
 this.fetch()
//daatsource variable global
// peux affciher le datsource à html grace au daat binding
}
displayedColumns: string[] = ['id', 'cin', 'name', 'type','cv','createDate','actions'];
delete(id :string){

  
   //1 ouvrire la boite
   let dialogRef = this.dialog.open(ConfirmDialogComponent, {
  height: '200px',
  width: '300px',
});
//attendre resultat user (clicck)
//click:confirm=>
   //lorsque appelle directement la composant confirm dialog affcihe comme u e page non dooalog
   // attend le click de user 
   // si click = confirm  =>
   dialogRef.afterClosed().subscribe((res)=>{
//subscribe jusqu'a  le fermeture de boite
if(res)
this.MS.deleteMemberById(id).subscribe(()=>{
  this.fetch()
   })

})
}

}
//l'application pres de madame :https://chlegou.com/lab/dashboard