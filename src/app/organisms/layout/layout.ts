import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen overflow-hidden bg-gray-50">

      <!-- Sidebar -->
      <aside class="flex flex-col w-56 min-h-screen bg-[#006926] text-white shadow-xl">

        <!-- Logo -->
        <div class="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 40 40" class="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="6" fill="white" fill-opacity="0.15"/>
              <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"
                    font-size="22" font-weight="bold" fill="white">U</text>
            </svg>
          </div>
          <div class="leading-tight">
            <p class="text-[11px] font-semibold tracking-wide uppercase text-white/80">Universidad</p>
            <p class="text-[11px] font-semibold tracking-wide uppercase text-white/80">del Quindío</p>
          </div>
        </div>

        <!-- Menu label -->
        <div class="px-5 pt-5 pb-2">
          <p class="text-[10px] uppercase tracking-widest text-white/50 font-semibold">Menú Principal</p>
        </div>

        <!-- Nav links -->
        <nav class="flex flex-col gap-1 px-3 flex-1">

          <!-- Inicio -->
          <a routerLink="/home" routerLinkActive="bg-white/15 font-semibold"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80
                    hover:bg-white/10 hover:text-white transition-all duration-150 group">
            <svg class="w-5 h-5 flex-shrink-0 text-white/70 group-hover:text-white transition-colors"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1
                   0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0
                   001 1m-6 0h6"/>
            </svg>
            Inicio
          </a>

          <!-- Solicitudes -->
          <a routerLink="/solicitudes" routerLinkActive="bg-white/15 font-semibold"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80
                    hover:bg-white/10 hover:text-white transition-all duration-150 group">
            <svg class="w-5 h-5 flex-shrink-0 text-white/70 group-hover:text-white transition-colors"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0
                   01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Solicitudes
          </a>

          <!-- Historial -->
          <a routerLink="/historial" routerLinkActive="bg-white/15 font-semibold"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80
                    hover:bg-white/10 hover:text-white transition-all duration-150 group">
            <svg class="w-5 h-5 flex-shrink-0 text-white/70 group-hover:text-white transition-colors"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Historial
          </a>

        </nav>

        <!-- Logout -->
        <div class="px-3 py-4 border-t border-white/10">
          <button (click)="logout()"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70
                   hover:bg-red-500/20 hover:text-white w-full transition-all duration-150 group">
            <svg class="w-5 h-5 flex-shrink-0 text-white/50 group-hover:text-white transition-colors"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3
                   0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Cerrar sesión
          </button>
        </div>

      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto">
        <router-outlet />
      </main>

    </div>
  `
})
export class LayoutComponent {
  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}