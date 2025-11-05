import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
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
import { EditProjectComponent } from './edit-project/edit-project.component';
import { EditLevelComponent } from './edit-level/edit-level.component';
import { EditMilestoneComponent } from './edit-milestone/edit-milestone.component';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    AddProjectComponent,
    AddLevelComponent,
    AddMilestoneComponent,
    ProjectsListComponent,
    ProjectsProgressComponent,
    LoginComponent,
    MyMilestonesComponent,
    UsersComponent,
    AddUserComponent,
    EditProjectComponent,
    EditLevelComponent,
    EditMilestoneComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
