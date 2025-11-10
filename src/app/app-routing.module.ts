import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemberComponent } from './member/member.component';
import { MemberFormComponent } from './member-form/member-form.component';
import { ToolComponent } from './tool/tool.component';
import { EventComponent } from './event/event.component';
import { ArticlesComponent } from './articles/articles.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  // lordre intervient (si si non si met ** le premier tous les liens devinet **)
  //n'importe quelle path n'est pas dans la liste devient dans  ** 
  // le ** devint la dérnoére
  // dans le path ne met pas /
    {
    path : '',
    component : DashboardComponent
  },
   {
    path : 'dashboard',
    component : DashboardComponent
  },
  {
    path : 'member',
    component : MemberComponent
  },
  { path : 'create',
    pathMatch : 'full' ,// un matching complet entre le path et le compsant si trouve create123 ne fait pas le matching
    component : MemberFormComponent},
      { path : ':id/edit',//c'est une valeur dynamisue l'id grace à : 
    pathMatch : 'full' ,// un matching complet entre le path et le compsant si trouve create123 ne fait pas le matching
    component : MemberFormComponent},
 { path : 'tools',
    pathMatch : 'full' ,// un matching complet entre le path et le compsant si trouve create123 ne fait pas le matching
    component : ToolComponent},
   { path : 'events',
    pathMatch : 'full' ,// un matching complet entre le path et le compsant si trouve create123 ne fait pas le matching
    component : EventComponent},  
     { path : 'articles',
    pathMatch : 'full' ,// un matching complet entre le path et le compsant si trouve create123 ne fait pas le matching
    component : ArticlesComponent},  


    { path : '**',// q'est ce que chose au dessus si ne trouve pas ses lien en accede a ** doit respecter l'ordre
    
    component : MemberFormComponent}
];
//ctrl+espace => importer

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// le role de se fichier fair ele corresepondance entre le path dasn url et le composant qui se affcihe dans se page 