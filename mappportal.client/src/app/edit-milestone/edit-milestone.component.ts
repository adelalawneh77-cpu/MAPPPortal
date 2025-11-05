import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ToastService } from '../services/toast.service';

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
  assignedUser?: {
    id: number;
    username: string;
    fullName?: string;
  };
}

interface User {
  id: number;
  username: string;
  fullName?: string;
}

@Component({
  selector: 'app-edit-milestone',
  templateUrl: './edit-milestone.component.html',
  standalone: false,
  styleUrl: './edit-milestone.component.css'
})
export class EditMilestoneComponent implements OnInit {
  @Input() milestoneId?: number;
  @Input() viewMode: boolean = false;
  @Output() milestoneUpdated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  milestoneForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  isLoadingUsers = false;
  milestone: Milestone | null = null;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastService: ToastService
  ) {
    this.milestoneForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      startDate: [''],
      endDate: [''],
      assignedUserId: ['']
    });
  }

  ngOnInit() {
    if (this.viewMode) {
      this.milestoneForm.disable();
    }
    this.loadUsers();
    if (this.milestoneId) {
      this.loadMilestone();
    }
  }

  loadMilestone() {
    if (!this.milestoneId) return;
    
    this.isLoading = true;
    const url = `${environment.apiUrl}/api/milestones/${this.milestoneId}`;
    this.http.get<Milestone>(url).subscribe({
      next: (milestone) => {
        this.milestone = milestone;
        const startDate = milestone.startDate ? new Date(milestone.startDate).toISOString().split('T')[0] : '';
        const endDate = milestone.endDate ? new Date(milestone.endDate).toISOString().split('T')[0] : '';
        this.milestoneForm.patchValue({
          name: milestone.name,
          percentage: milestone.percentage,
          startDate: startDate,
          endDate: endDate,
          assignedUserId: milestone.assignedUserId || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading milestone:', error);
        alert('حدث خطأ أثناء تحميل بيانات المعلم');
        this.isLoading = false;
      }
    });
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

  setViewMode(viewMode: boolean) {
    this.viewMode = viewMode;
    if (viewMode) {
      this.milestoneForm.disable();
    } else {
      this.milestoneForm.enable();
    }
  }

  onSubmit() {
    if (this.milestoneForm.valid && !this.viewMode) {
      this.isSubmitting = true;
      const milestoneData = {
        name: this.milestoneForm.value.name,
        percentage: this.milestoneForm.value.percentage,
        startDate: this.milestoneForm.value.startDate || null,
        endDate: this.milestoneForm.value.endDate || null,
        assignedUserId: this.milestoneForm.value.assignedUserId || null
      };

      const url = `${environment.apiUrl}/api/milestones/${this.milestoneId}`;
      this.http.put(url, milestoneData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).subscribe({
        next: () => {
          this.toastService.success('تم تحديث المعلم بنجاح');
          this.milestoneUpdated.emit();
        },
        error: (error) => {
          console.error('Error updating milestone:', error);
          let errorMessage = 'حدث خطأ أثناء تحديث المعلم';
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

  formatDate(dateString?: string): string {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}

