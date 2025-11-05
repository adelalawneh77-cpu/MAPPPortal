import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ModalType = 'add-user' | 'add-project' | 'add-level' | 'add-milestone' | null;

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<{ type: ModalType; data?: any }>({ type: null });
  public modal$: Observable<{ type: ModalType; data?: any }> = this.modalSubject.asObservable();

  openModal(type: ModalType, data?: any) {
    this.modalSubject.next({ type, data });
  }

  closeModal() {
    this.modalSubject.next({ type: null });
  }
}

