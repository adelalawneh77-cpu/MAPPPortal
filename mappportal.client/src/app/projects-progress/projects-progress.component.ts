import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface Milestone {
  id: number;
  name: string;
  levelId: number;
  percentage: number;
}

interface Level {
  id: number;
  name: string;
  projectId: number;
  percentage: number;
  milestones: Milestone[];
}

interface Project {
  id: number;
  name: string;
  description?: string;
  issues?: string;
  percentage: number;
  levels: Level[];
}

@Component({
  selector: 'app-projects-progress',
  templateUrl: './projects-progress.component.html',
  standalone: false,
  styleUrl: './projects-progress.component.css'
})
export class ProjectsProgressComponent implements OnInit {
  projects: Project[] = [];
  isLoading = true;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading = true;
    const url = `${environment.apiUrl}/api/projects`;
    this.http.get<Project[]>(url).subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.isLoading = false;
      }
    });
  }

  getProjectProgress(project: Project): number {
    return project.percentage || 0;
  }

  isProjectCompleted(project: Project): boolean {
    return project.percentage >= 100;
  }

  getCompletedProjectsCount(): number {
    return this.projects.filter(p => this.isProjectCompleted(p)).length;
  }

  getInProgressProjectsCount(): number {
    return this.projects.filter(p => !this.isProjectCompleted(p)).length;
  }

  getLevelProgress(level: Level): number {
    return level.percentage || 0;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}

