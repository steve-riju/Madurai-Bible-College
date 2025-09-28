import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminUsersService, User } from '../services/admin-users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  pagedUsers: User[] = []; // ✅ for pagination
  userForm!: FormGroup;

  // filters
  filterRole: string = ''; 
  sortAsc: boolean = true;
  searchTerm: string = ''; 

  // delete confirmation state
confirmDeleteId: number | null | undefined = null;

  // pagination
  currentPage: number = 1;
  pageSize: number = 25; // ✅ show 25 per page
  totalPages: number = 1;

  constructor(private fb: FormBuilder, private adminUsersService: AdminUsersService) {}

  ngOnInit(): void {
    this.loadUsers();

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['STUDENT', Validators.required]
    });
  }

  loadUsers(): void {
    this.adminUsersService.getUsers().subscribe(users => {
      this.users = users;
      this.applyFilters();
    });
  }

  addUser(): void {
    if (this.userForm.invalid) return;
    const newUser: User = this.userForm.value;

    this.adminUsersService.createUser(newUser).subscribe(() => {
      this.loadUsers();
      this.userForm.reset({ role: 'STUDENT' });
    });
  }

  // ✅ Inline delete confirm
  askDeleteUser(id: number): void {
    this.confirmDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  deleteUser(id?: number): void {
  if (!id) return; // ✅ prevent undefined issue
  this.adminUsersService.deleteUser(id).subscribe(() => {
    this.loadUsers();
    this.confirmDeleteId = null;
  });
}


  // ✅ Filter + Sort + Search + Pagination
  applyFilters(): void {
    this.filteredUsers = [...this.users];

    // Filter by role
    if (this.filterRole) {
      this.filteredUsers = this.filteredUsers.filter(u => u.role === this.filterRole);
    }

    // Search
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      this.filteredUsers = this.filteredUsers.filter(u =>
        u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    // Sort by username
    this.filteredUsers.sort((a, b) =>
      this.sortAsc ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username)
    );

    // Pagination
    this.totalPages = Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.updatePagedUsers();
  }

  updatePagedUsers(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedUsers = this.filteredUsers.slice(start, start + this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedUsers();
    }
  }

  changeRoleFilter(role: string): void {
    this.filterRole = role;
    this.applyFilters();
  }

  toggleSort(): void {
    this.sortAsc = !this.sortAsc;
    this.applyFilters();
  }
}
