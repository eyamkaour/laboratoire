import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from 'src/Services/member.service';
@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {
  constructor(private MS:MemberService ,private  router:Router,private activatedRoute: ActivatedRoute){}
form! : FormGroup ;
onsub(){
    const idCourant =this.activatedRoute.snapshot.params['id']
  // si id existe => je suis dans edit
  console.log("id courant  " +idCourant)
  if(idCourant){
    console.log("form value")
    console.log(this.form.value)
    this.MS.updateMmber(idCourant ,this.form.value).subscribe(()=>{})
  }
  else{
     //recuper tion de donnes
  console.log(this.form.value)
  //extraction de form .value de x en creer 4 attrubut dabs x
  const x = {...this.form.value , createDate: (new Date()).toISOString()}
  //appeller la foonction du service 
  //=< INJEXTER LA DEPendance
  this.MS.addMember(x).subscribe
  (()=>{})
//resirection
this.router.navigate(['/'])
  }
 
}

ngOnInit(): void {

  //1 recuperer la route active
  //fair capture avec snapshot puis fragmanter et donne le parm id
     //2 chehcer id
  const idCourant =this.activatedRoute.snapshot.params['id']
  // si id existe => je suis dans edit
  console.log("id courant  " +idCourant)
  if(idCourant){
    console.log("id courant existe")
    this.MS.getMemberById(idCourant).subscribe((x)=>{
      console.log(x.cin)
     this.form = new FormGroup({
    cin : new FormControl(x.cin , Validators.required), // initialiser par null  c'est un champ requis mais peux l'envoyer
    name  : new FormControl(x.name , Validators.required),
    type: new FormControl(x.type , Validators.required),
    cv: new FormControl(x.cv , Validators.required),

  })
    })
  }else{
     console.log("id courant non  existe")
      //si non 
  this.form = new FormGroup({
    cin : new FormControl(null , Validators.required), // initialiser par null  c'est un champ requis mais peux l'envoyer
    name  : new FormControl(null , Validators.required),
    type: new FormControl(null , Validators.required),
    cv : new FormControl(null , Validators.required),

  })
  }


}
} 
