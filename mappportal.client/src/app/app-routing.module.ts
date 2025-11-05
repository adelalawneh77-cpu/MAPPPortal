import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { AddLevelComponent } from './add-level/add-level.component';
import { AddMilestoneComponent } from './add-milestone/add-milestone.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectsProgressComponent } from './projects-progress/projects-progress.component';
import { LoginComponent } from './login/login.component';
import { MyMilestonesComponent } from './my-milestones/my-milestones.component';
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './add-user/add-user.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
  { path: 'dashboard', component: AppComponent },
  { path: 'my-milestones', component: MyMilestonesComponent },
  { path: 'projects', component: ProjectsListComponent },
  { path: 'projects-progress', component: ProjectsProgressComponent },
  { path: 'users', component: UsersComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'add-project', component: AddProjectComponent },
  { path: 'add-level', component: AddLevelComponent },
  { path: 'add-milestone', component: AddMilestoneComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
