import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  standalone: false,
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {
  @Output() projectAdded = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  projectForm: FormGroup;
  isSubmitting = false;

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

  onSubmit() {
    if (this.projectForm.valid) {
      this.isSubmitting = true;
      const projectData = {
        name: this.projectForm.value.name,
        description: this.projectForm.value.description || null,
        issues: this.projectForm.value.issues || null
      };

      const url = `${environment.apiUrl}/api/projects`;
      console.log('Sending POST request to:', url);
      this.http.post(url, projectData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).subscribe({
        next: (response) => {
          console.log('Project created successfully:', response);
          this.toastService.success('تم إضافة المشروع بنجاح');
          this.projectAdded.emit();
        },
        error: (error) => {
          console.error('Error adding project:', error);
          console.error('Error details:', error.error);
          console.error('Status:', error.status);
          console.error('Status text:', error.statusText);
          let errorMessage = 'حدث خطأ أثناء إضافة المشروع';
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

