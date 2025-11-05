import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ToastService } from '../services/toast.service';

interface Level {
  id: number;
  name: string;
  projectId: number;
  percentage: number;
  project?: {
    id: number;
    name: string;
  };
}

@Component({
  selector: 'app-edit-level',
  templateUrl: './edit-level.component.html',
  standalone: false,
  styleUrl: './edit-level.component.css'
})
export class EditLevelComponent implements OnInit {
  @Input() levelId?: number;
  @Input() viewMode: boolean = false;
  @Output() levelUpdated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  
  levelForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  level: Level | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastService: ToastService
  ) {
    this.levelForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  ngOnInit() {
    if (this.viewMode) {
      this.levelForm.disable();
    }
    if (this.levelId) {
      this.loadLevel();
    }
  }

  loadLevel() {
    if (!this.levelId) return;
    
    this.isLoading = true;
    const url = `${environment.apiUrl}/api/levels/${this.levelId}`;
    this.http.get<Level>(url).subscribe({
      next: (level) => {
        this.level = level;
        this.levelForm.patchValue({
          name: level.name
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading level:', error);
        alert('حدث خطأ أثناء تحميل بيانات المستوى');
        this.isLoading = false;
      }
    });
  }

  setViewMode(viewMode: boolean) {
    this.viewMode = viewMode;
    if (viewMode) {
      this.levelForm.disable();
    } else {
      this.levelForm.enable();
    }
  }

  onSubmit() {
    if (this.levelForm.valid && !this.viewMode) {
      this.isSubmitting = true;
      const levelData = {
        name: this.levelForm.value.name
      };

      const url = `${environment.apiUrl}/api/levels/${this.levelId}`;
      this.http.put(url, levelData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).subscribe({
        next: () => {
          this.toastService.success('تم تحديث المستوى بنجاح');
          this.levelUpdated.emit();
        },
        error: (error) => {
          console.error('Error updating level:', error);
          let errorMessage = 'حدث خطأ أثناء تحديث المستوى';
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

