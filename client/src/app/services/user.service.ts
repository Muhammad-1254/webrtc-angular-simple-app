import { Injectable, signal } from '@angular/core';
import { User } from '../shared/interfaces';

@Injectable({ providedIn: 'root' })
export class UserService {
  user = signal<User | undefined>(
    localStorage.getItem('username')
      ? {username:localStorage.getItem('username')!}
      : undefined
  );
  users = signal<User[]>([]);

  getUser() {
    return this.user();
  }
  getUsers() {
    return this.users();
  }

  setUser(user: User) {
    this.user.set(user);
    localStorage.setItem('username', user.username);
  }
  setUsers(users: User[]) {
    this.users.set(users);
  }
}
