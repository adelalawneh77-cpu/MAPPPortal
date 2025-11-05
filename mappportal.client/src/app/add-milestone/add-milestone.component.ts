import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ToastService } from '../services/toast.service';

interface Level {
  id: number;
  name: string;
  projectId: number;
}

interface User {
  id: number;
  username: string;
  fullName?: string;
}

@Component({
  selector: 'app-add-milestone',
  templateUrl: './add-milestone.component.html',
  standalone: false,
  styleUrl: './add-milestone.component.css'
})
export class AddMilestoneComponent implements OnInit {
  @Input() levelId?: number;
  @Input() projectId?: number;
  @Output() milestoneAdded = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  milestoneForm: FormGroup;
  levels: Level[] = [];
  allLevels: Level[] = [];
  projects: any[] = [];
  users: User[] = [];
  selectedProjectId: number | null = null;
  isSubmitting = false;
  isLoadingLevels = true;
  isLoadingProjects = false;
  isLoadingUsers = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastService: ToastService
  ) {
    this.milestoneForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      levelId: ['', [Validators.required]],
      projectId: [''],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      startDate: [''],
      endDate: [''],
      assignedUserId: ['']
    });
  }

  ngOnInit() {
    if (this.levelId) {
      this.milestoneForm.patchValue({
        levelId: this.levelId
      });
    }
    if (this.projectId) {
      this.selectedProjectId = this.projectId;
      this.milestoneForm.patchValue({
        projectId: this.projectId
      });
    }
    this.loadProjects();
    this.loadLevels();
    this.loadUsers();
  }

  loadProjects() {
    this.isLoadingProjects = true;
    const url = `${environment.apiUrl}/api/projects`;
    this.http.get<any[]>(url).subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoadingProjects = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.isLoadingProjects = false;
      }
    });
  }

  loadLevels() {
    this.isLoadingLevels = true;
    const url = `${environment.apiUrl}/api/levels`;
    console.log('Loading levels from:', url);
    this.http.get<Level[]>(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe({
      next: (levels) => {
        this.allLevels = levels;
        this.filterLevels();
        this.isLoadingLevels = false;
      },
      error: (error) => {
        console.error('Error loading levels:', error);
        this.isLoadingLevels = false;
      }
    });
  }

  onProjectChange() {
    const projectId = this.milestoneForm.value.projectId;
    this.selectedProjectId = projectId ? parseInt(projectId) : null;
    this.filterLevels();
    // Reset levelId when project changes
    this.milestoneForm.patchValue({ levelId: '' });
  }

  filterLevels() {
    if (this.selectedProjectId) {
      this.levels = this.allLevels.filter(level => level.projectId === this.selectedProjectId);
    } else {
      this.levels = this.allLevels;
    }
  }

  loadUsers() {
    this.isLoadingUsers = true;
    const url = `${environment.apiUrl}/api/users`;
    this.http.get<User[]>(url).subscribe({
      next: (users) => {
        this.users = users;
        this.isLoadingUsers = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoadingUsers = false;
      }
    });
  }

  onSubmit() {
    if (this.milestoneForm.valid) {
      this.isSubmitting = true;
      const milestoneData = {
        name: this.milestoneForm.value.name,
        levelId: parseInt(this.milestoneForm.value.levelId),
        percentage: parseFloat(this.milestoneForm.value.percentage) || 0,
        startDate: this.milestoneForm.value.startDate || null,
        endDate: this.milestoneForm.value.endDate || null,
        assignedUserId: this.milestoneForm.value.assignedUserId ? parseInt(this.milestoneForm.value.assignedUserId) : null
      };

      const url = `${environment.apiUrl}/api/milestones`;
      console.log('Sending POST request to:', url);
      this.http.post(url, milestoneData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).subscribe({
        next: (response) => {
          console.log('Milestone created successfully:', response);
          this.toastService.success('تم إضافة المعلم بنجاح');
          this.milestoneAdded.emit();
        },
        error: (error) => {
          console.error('Error adding milestone:', error);
          console.error('Error details:', error.error);
          let errorMessage = 'حدث خطأ أثناء إضافة المعلم';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors) {
            const validationErrors = Object.values(error.error.errors).flat();
            errorMessage = `خطأ في التحقق: ${validationErrors.join(', ')}`;
          } else if (error.message) {
            errorMessage = error.message;
          }
          this.toastService.error(errorMessage);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}

