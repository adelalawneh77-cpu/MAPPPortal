import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ModalService } from '../services/modal.service';
import { Subscription } from 'rxjs';

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
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  standalone: false,
  styleUrl: './projects-list.component.css'
})
export class ProjectsListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  isLoading = true;
  selectedProjectId: number | null = null;
  selectedLevelId: number | null = null;
  
  // Tab management
  activeTab: 'list' | 'overview' = 'list';
  
  // Overview stats
  completedProjects: number = 0;
  inProgressProjects: number = 0;
  
  showAddProjectModal = false;
  showAddLevelModal = false;
  showAddMilestoneModal = false;
  showEditProjectModal = false;
  showEditLevelModal = false;
  showEditMilestoneModal = false;
  showViewProjectModal = false;
  showViewLevelModal = false;
  showViewMilestoneModal = false;
  modalData: any = {};
  private modalSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadProjects();
    this.modalSubscription = this.modalService.modal$.subscribe(modal => {
      this.showAddProjectModal = modal.type === 'add-project';
      this.showAddLevelModal = modal.type === 'add-level';
      this.showAddMilestoneModal = modal.type === 'add-milestone';
      this.modalData = modal.data || {};
    });
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  loadProjects() {
    this.isLoading = true;
    const url = `${environment.apiUrl}/api/projects`;
    this.http.get<Project[]>(url).subscribe({
      next: (projects) => {
        this.projects = projects;
        this.updateProjectStats(projects);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.isLoading = false;
      }
    });
  }

  updateProjectStats(projects: Project[]) {
    this.completedProjects = projects.filter(p => p.percentage >= 100).length;
    this.inProgressProjects = projects.filter(p => p.percentage < 100).length;
  }

  switchTab(tab: 'list' | 'overview') {
    this.activeTab = tab;
  }

  // Calculate pie chart paths
  getCompletedSlicePath(): string {
    const total = this.completedProjects + this.inProgressProjects;
    if (total === 0) return '';

    const centerX = 150;
    const centerY = 150;
    const radius = 120;
    const innerRadius = 70;
    
    const completedPercentage = this.completedProjects / total;
    const angle = completedPercentage * 2 * Math.PI;
    
    if (completedPercentage >= 1) {
      // Full circle
      return `M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 1 1 ${centerX} ${centerY + radius} A ${radius} ${radius} 0 1 1 ${centerX} ${centerY - radius} Z 
              M ${centerX} ${centerY - innerRadius} A ${innerRadius} ${innerRadius} 0 1 0 ${centerX} ${centerY + innerRadius} A ${innerRadius} ${innerRadius} 0 1 0 ${centerX} ${centerY - innerRadius} Z`;
    }
    
    const endX = centerX + radius * Math.sin(angle);
    const endY = centerY - radius * Math.cos(angle);
    const innerEndX = centerX + innerRadius * Math.sin(angle);
    const innerEndY = centerY - innerRadius * Math.cos(angle);
    
    const largeArcFlag = completedPercentage > 0.5 ? 1 : 0;
    
    return `M ${centerX} ${centerY - radius} 
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
            L ${innerEndX} ${innerEndY}
            A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${centerX} ${centerY - innerRadius} Z`;
  }

  getInProgressSlicePath(): string {
    const total = this.completedProjects + this.inProgressProjects;
    if (total === 0 || this.inProgressProjects === 0) return '';

    const centerX = 150;
    const centerY = 150;
    const radius = 120;
    const innerRadius = 70;
    
    const completedPercentage = this.completedProjects / total;
    const inProgressPercentage = this.inProgressProjects / total;
    
    const startAngle = completedPercentage * 2 * Math.PI;
    const endAngle = (completedPercentage + inProgressPercentage) * 2 * Math.PI;
    
    const startX = centerX + radius * Math.sin(startAngle);
    const startY = centerY - radius * Math.cos(startAngle);
    const endX = centerX + radius * Math.sin(endAngle);
    const endY = centerY - radius * Math.cos(endAngle);
    
    const innerStartX = centerX + innerRadius * Math.sin(startAngle);
    const innerStartY = centerY - innerRadius * Math.cos(startAngle);
    const innerEndX = centerX + innerRadius * Math.sin(endAngle);
    const innerEndY = centerY - innerRadius * Math.cos(endAngle);
    
    const largeArcFlag = inProgressPercentage > 0.5 ? 1 : 0;
    
    return `M ${startX} ${startY}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
            L ${innerEndX} ${innerEndY}
            A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY} Z`;
  }

  addProject() {
    this.modalService.openModal('add-project');
  }

  viewProject(projectId: number, event?: Event) {
    if (event) event.stopPropagation();
    this.modalData = { projectId, viewMode: true };
    this.showViewProjectModal = true;
  }

  editProject(projectId: number, event?: Event) {
    if (event) event.stopPropagation();
    this.modalData = { projectId, viewMode: false };
    this.showEditProjectModal = true;
  }

  viewLevel(levelId: number, event?: Event) {
    if (event) event.stopPropagation();
    this.modalData = { levelId, viewMode: true };
    this.showViewLevelModal = true;
  }

  editLevel(levelId: number, event?: Event) {
    if (event) event.stopPropagation();
    this.modalData = { levelId, viewMode: false };
    this.showEditLevelModal = true;
  }

  viewMilestone(milestoneId: number, event?: Event) {
    if (event) event.stopPropagation();
    this.modalData = { milestoneId, viewMode: true };
    this.showViewMilestoneModal = true;
  }

  editMilestone(milestoneId: number, event?: Event) {
    if (event) event.stopPropagation();
    this.modalData = { milestoneId, viewMode: false };
    this.showEditMilestoneModal = true;
  }

  onProjectUpdated() {
    this.showEditProjectModal = false;
    this.showViewProjectModal = false;
    this.loadProjects();
  }

  onLevelUpdated() {
    this.showEditLevelModal = false;
    this.showViewLevelModal = false;
    this.loadProjects();
  }

  onMilestoneUpdated() {
    this.showEditMilestoneModal = false;
    this.showViewMilestoneModal = false;
    this.loadProjects();
  }

  onEditProjectCancel() {
    this.showEditProjectModal = false;
    this.showViewProjectModal = false;
  }

  onEditLevelCancel() {
    this.showEditLevelModal = false;
    this.showViewLevelModal = false;
  }

  onEditMilestoneCancel() {
    this.showEditMilestoneModal = false;
    this.showViewMilestoneModal = false;
  }

  addLevel(projectId?: number) {
    this.modalService.openModal('add-level', { projectId });
  }

  addMilestone(levelId?: number, projectId?: number) {
    this.modalService.openModal('add-milestone', { levelId, projectId });
  }

  onProjectAdded() {
    this.loadProjects();
    this.modalService.closeModal();
  }

  onLevelAdded() {
    this.loadProjects();
    this.modalService.closeModal();
  }

  onMilestoneAdded() {
    this.loadProjects();
    this.modalService.closeModal();
  }

  onAddProjectCancel() {
    this.modalService.closeModal();
  }

  onAddLevelCancel() {
    this.modalService.closeModal();
  }

  onAddMilestoneCancel() {
    this.modalService.closeModal();
  }

  toggleProject(projectId: number) {
    this.selectedProjectId = this.selectedProjectId === projectId ? null : projectId;
    this.selectedLevelId = null;
  }

  toggleLevel(levelId: number) {
    this.selectedLevelId = this.selectedLevelId === levelId ? null : levelId;
  }

  deleteProject(projectId: number) {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟ سيتم حذف جميع المستويات والمعالم المرتبطة به.')) {
      const url = `${environment.apiUrl}/api/projects/${projectId}`;
      this.http.delete(url).subscribe({
        next: () => {
          alert('تم حذف المشروع بنجاح');
          this.loadProjects();
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          alert('حدث خطأ أثناء حذف المشروع');
        }
      });
    }
  }

  deleteLevel(levelId: number) {
    if (confirm('هل أنت متأكد من حذف هذا المستوى؟ سيتم حذف جميع المعالم المرتبطة به.')) {
      const url = `${environment.apiUrl}/api/levels/${levelId}`;
      this.http.delete(url).subscribe({
        next: () => {
          alert('تم حذف المستوى بنجاح');
          this.loadProjects();
        },
        error: (error) => {
          console.error('Error deleting level:', error);
          alert('حدث خطأ أثناء حذف المستوى');
        }
      });
    }
  }

  deleteMilestone(milestoneId: number) {
    if (confirm('هل أنت متأكد من حذف هذا المعلم؟')) {
      const url = `${environment.apiUrl}/api/milestones/${milestoneId}`;
      this.http.delete(url).subscribe({
        next: () => {
          alert('تم حذف المعلم بنجاح');
          this.loadProjects();
        },
        error: (error) => {
          console.error('Error deleting milestone:', error);
          alert('حدث خطأ أثناء حذف المعلم');
        }
      });
    }
  }
}

