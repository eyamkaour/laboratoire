import { Component ,AfterViewInit,ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort } from '@angular/material/sort';
import { EventServiceService } from 'src/Services/eventservice.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventCreateComponent } from '../event-create/event-create.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent  implements   AfterViewInit{
delete(arg0: any) {
throw new Error('Method not implemented.');
}

    dataSource: MatTableDataSource<Event>;// le tableaux doit etre de type material app datasource 
  @ViewChild(MatPaginator) paginator !: MatPaginator; // ! ne donne pas le type 
  @ViewChild(MatSort) sort !: MatSort;
  constructor(private ES: EventServiceService, private dialog:MatDialog) {
 

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
  }
  open() {
const dialogRef= this.dialog.open(EventCreateComponent)
dialogRef.afterClosed().subscribe((data)=>{
  this.ES.addEvent(data).subscribe(()=>{
   this.ES.GetAllEventes().subscribe((res)=>{
      this.dataSource.data=res ; // .data ahbat lel contenu mta3 material daatsourcr 
      // material daatsource kif array ya3ni type tableaux lezm zouz ikouno compatibele donce na3mlo.daat eli houma zoue type Event//
    })
  })
})
}
// type script ne pas surcharge de methode la methode n'a aps le meme nonm malgre que les parametre change alors que dans java passe

  openedit(id:string){
    //lancer la boite et envoyer id //pas de surcharge dans angular 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data=id;
  //dialogConfig.disableClose = true;
   // dialogConfig.autoFocus = true;
   const dialogRef = this.dialog.open(EventCreateComponent, dialogConfig);
   dialogRef.afterClosed().subscribe((data)=>{
  this.ES.updateEvent(data , id).subscribe(()=>{
     this.ES.GetAllEventes().subscribe((res)=>{
      this.dataSource.data=res ; // .data ahbat lel contenu mta3 material daatsourcr 
      // material daatsource kif array ya3ni type tableaux lezm zouz ikouno compatibele donce na3mlo.daat eli houma zoue type Event//
    })
})
  })
}

  ngOnInit(): void {
    
  }

  displayedColumns: string[] = ['id', 'titre', 'date', 'lieu','actions'];
 // le tableaux doit etre de type material app datasource 
//dataSource: Event[]=[];
//fonction lance automatiquement  ngAfterViewInit
  ngAfterViewInit() {
    this.ES.GetAllEventes().subscribe((res)=>{
      this.dataSource.data=res ; // .data ahbat lel contenu mta3 material daatsourcr 
      // material daatsource kif array ya3ni type tableaux lezm zouz ikouno compatibele donce na3mlo.daat eli houma zoue type Event//
    })
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
}


 