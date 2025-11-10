import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EventServiceService } from 'src/Services/eventservice.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {
  form! : FormGroup ;
  constructor(
       public dialogRef: MatDialogRef<ConfirmDialogComponent>// forsage de type ou j'appele ,
       , @Inject (MAT_DIALOG_DATA) data:any ,// @inject recevoir des données extrieur reception l'ide trouve dans le boite
        private ES:EventServiceService
  ){
    if(data){
// si trouve data edit 
this.ES.getEventById(data).subscribe((res)=>{
    this.form = new FormGroup({
        titre: new FormControl(res.titre), // initialiser par null  c'est un champ requis mais peux l'envoyer
        date  : new FormControl(res.date , Validators.required),
        lieu: new FormControl(res.lieu, Validators.required),
    
    
      })
})
    }else {
        this.form = new FormGroup({
        titre: new FormControl(null, Validators.required), // initialiser par null  c'est un champ requis mais peux l'envoyer
        date  : new FormControl(null , Validators.required),
        lieu: new FormControl(null, Validators.required),
    
    
      })
    }
    
  }
  save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }
}
