import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ToastService } from '../services/toast.service';

interface Project {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add-level',
  templateUrl: './add-level.component.html',
  standalone: false,
  styleUrl: './add-level.component.css'
})
export class AddLevelComponent implements OnInit {
  @Input() projectId?: number;
  @Output() levelAdded = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  levelForm: FormGroup;
  projects: Project[] = [];
  isSubmitting = false;
  isLoadingProjects = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastService: ToastService
  ) {
    this.levelForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      projectId: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.projectId) {
      this.levelForm.patchValue({
        projectId: this.projectId
      });
    }
    this.loadProjects();
  }

  loadProjects() {
    this.isLoadingProjects = true;
    const url = `${environment.apiUrl}/api/projects`;
    console.log('Loading projects from:', url);
    this.http.get<Project[]>(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe({
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

  onSubmit() {
    if (this.levelForm.valid) {
      this.isSubmitting = true;
      const levelData = {
        name: this.levelForm.value.name,
        projectId: parseInt(this.levelForm.value.projectId)
      };

      const url = `${environment.apiUrl}/api/levels`;
      console.log('Sending POST request to:', url);
      this.http.post(url, levelData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).subscribe({
        next: (response) => {
          console.log('Level created successfully:', response);
          this.toastService.success('تم إضافة المستوى بنجاح');
          this.levelAdded.emit();
        },
        error: (error) => {
          console.error('Error adding level:', error);
          console.error('Error details:', error.error);
          console.error('Full error object:', JSON.stringify(error, null, 2));
          
          let errorMessage = 'حدث خطأ أثناء إضافة المستوى';
          
          if (error.error) {
            if (error.error.message) {
              errorMessage = error.error.message;
            } else if (error.error.errors) {
              // Handle validation errors
              const validationErrors = Object.values(error.error.errors).flat();
              errorMessage = `خطأ في التحقق: ${validationErrors.join(', ')}`;
            } else if (typeof error.error === 'string') {
              errorMessage = error.error;
            }
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

