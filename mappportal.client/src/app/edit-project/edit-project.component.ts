import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ToastService } from '../services/toast.service';

interface Project {
  id: number;
  name: string;
  description?: string;
  issues?: string;
  percentage: number;
}

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  standalone: false,
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent implements OnInit {
  @Input() projectId?: number;
  @Input() viewMode: boolean = false;
  @Output() projectUpdated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  projectForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  project: Project | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastService: ToastService
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      issues: ['']
    });
  }

  ngOnInit() {
    if (this.viewMode) {
      this.projectForm.disable();
    }
    if (this.projectId) {
      this.loadProject();
    }
  }

  loadProject() {
    if (!this.projectId) return;
    
    this.isLoading = true;
    const url = `${environment.apiUrl}/api/projects/${this.projectId}`;
    this.http.get<Project>(url).subscribe({
      next: (project) => {
        this.project = project;
        this.projectForm.patchValue({
          name: project.name,
          description: project.description || '',
          issues: project.issues || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        alert('حدث خطأ أثناء تحميل بيانات المشروع');
        this.isLoading = false;
      }
    });
  }

  setViewMode(viewMode: boolean) {
    this.viewMode = viewMode;
    if (viewMode) {
      this.projectForm.disable();
    } else {
      this.projectForm.enable();
    }
  }

  onSubmit() {
    if (this.projectForm.valid && !this.viewMode) {
      this.isSubmitting = true;
      const projectData = {
        name: this.projectForm.value.name,
        description: this.projectForm.value.description || null,
        issues: this.projectForm.value.issues || null
      };

      const url = `${environment.apiUrl}/api/projects/${this.projectId}`;
      this.http.put(url, projectData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).subscribe({
        next: () => {
          this.toastService.success('تم تحديث المشروع بنجاح');
          this.projectUpdated.emit();
        },
        error: (error) => {
          console.error('Error updating project:', error);
          let errorMessage = 'حدث خطأ أثناء تحديث المشروع';
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
