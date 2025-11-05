import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ModalService } from '../services/modal.service';
import { Subscription } from 'rxjs';

interface User {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: false,
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  isLoading = true;
  showAddUserModal = false;
  private modalSubscription?: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.modalSubscription = this.modalService.modal$.subscribe(modal => {
      this.showAddUserModal = modal.type === 'add-user';
    });
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  loadUsers() {
    this.isLoading = true;
    const url = `${environment.apiUrl}/api/users`;
    this.http.get<User[]>(url).subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  addUser() {
    this.modalService.openModal('add-user');
  }

  onUserAdded() {
    this.loadUsers();
    this.modalService.closeModal();
  }

  onUserCancel() {
    this.modalService.closeModal();
  }

  deleteUser(userId: number) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      const url = `${environment.apiUrl}/api/users/${userId}`;
      this.http.delete(url).subscribe({
        next: () => {
          alert('تم حذف المستخدم بنجاح');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('حدث خطأ أثناء حذف المستخدم');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}

