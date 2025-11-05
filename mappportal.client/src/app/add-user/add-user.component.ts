import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  standalone: false,
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  @Output() userAdded = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  userForm: FormGroup;
  isSubmitting = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastService: ToastService
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', [Validators.maxLength(200)]],
      email: ['', [Validators.email]]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const userData = {
        username: this.userForm.value.username,
        password: this.userForm.value.password,
        fullName: this.userForm.value.fullName || null,
        email: this.userForm.value.email || null
      };

      const url = `${environment.apiUrl}/api/auth/register`;
      console.log('Sending POST request to:', url);
      this.http.post(url, userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.toastService.success('تم إضافة المستخدم بنجاح');
          this.userAdded.emit();
        },
        error: (error) => {
          console.error('Error adding user:', error);
          console.error('Error details:', error.error);
          let errorMessage = 'حدث خطأ أثناء إضافة المستخدم';
          
          if (error.error) {
            if (error.error.message) {
              errorMessage = error.error.message;
            } else if (error.error.errors) {
              const validationErrors = Object.values(error.error.errors).flat();
              errorMessage = `خطأ في التحقق: ${validationErrors.join(', ')}`;
            }
          }
          
          this.toastService.error(errorMessage);
          this.isSubmitting = false;
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onCancel() {
    this.cancel.emit();
  }
}

