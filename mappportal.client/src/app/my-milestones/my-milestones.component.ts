import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

interface Milestone {
  id: number;
  name: string;
  levelId: number;
  percentage: number;
  startDate?: string;
  endDate?: string;
  assignedUserId?: number;
  level?: {
    id: number;
    name: string;
    projectId: number;
    project?: {
      id: number;
      name: string;
    };
  };
}

@Component({
  selector: 'app-my-milestones',
  templateUrl: './my-milestones.component.html',
  standalone: false,
  styleUrl: './my-milestones.component.css'
})
export class MyMilestonesComponent implements OnInit {
  milestones: Milestone[] = [];
  isLoading = true;
  currentUser: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadMilestones();
  }

  loadMilestones() {
    if (!this.currentUser) return;
    
    this.isLoading = true;
    const url = `${environment.apiUrl}/api/milestones/user/${this.currentUser.id}`;
    this.http.get<Milestone[]>(url).subscribe({
      next: (milestones) => {
        this.milestones = milestones;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading milestones:', error);
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  getStatusClass(milestone: Milestone): string {
    if (milestone.percentage >= 100) return 'completed';
    
    // Check if milestone has started based on start date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    if (milestone.startDate) {
      const startDate = new Date(milestone.startDate);
      startDate.setHours(0, 0, 0, 0); // Reset time to start of day
      
      // If start date has passed or is today, milestone has started
      if (startDate <= today) {
        return 'in-progress';
      }
    }
    
    // If no start date or start date is in the future, not started
    return 'not-started';
  }

  getStatusText(milestone: Milestone): string {
    if (milestone.percentage >= 100) return 'مكتمل';
    
    // Check if milestone has started based on start date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    if (milestone.startDate) {
      const startDate = new Date(milestone.startDate);
      startDate.setHours(0, 0, 0, 0); // Reset time to start of day
      
      // If start date has passed or is today, milestone has started
      if (startDate <= today) {
        return 'قيد التنفيذ';
      }
    }
    
    // If no start date or start date is in the future, not started
    return 'لم يبدأ';
  }

  goBack() {
      this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
  }
}

