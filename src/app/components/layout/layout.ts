import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
})
export class LayoutComponent {

  role: string = "";

  constructor(private auth: AuthService) {
    this.role = this.auth.getPayload().rol || "";
    console.log(this.role);
  }

  logout() {
    this.auth.logout();
  }
}