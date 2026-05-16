import { Component, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SolicitudService, HistorialDTO, EstadoSolicitud } from '../../core/services/solicitud.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './historial.html'
})
export class HistorialComponent implements OnInit {
  solicitudId = new FormControl<number | null>(null);
  historial = signal<HistorialDTO[]>([]);
  loading = signal(false);
  error = signal('');
  buscado = signal(false);

  constructor(private solicitudService: SolicitudService) {}

  ngOnInit() {}

  buscar() {
    const id = this.solicitudId.value;
    if (!id) return;
    this.loading.set(true);
    this.error.set('');
    this.buscado.set(true);
    this.solicitudService.getHistorial(id).subscribe({
      next: data => { this.historial.set(data); this.loading.set(false); },
      error: () => { this.error.set('No se encontró historial para esa solicitud.'); this.loading.set(false); }
    });
  }

  formatFecha(f: string): string {
    if (!f) return '-';
    return new Date(f).toLocaleString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  estadoClase(estado: EstadoSolicitud): string {
    const map: Record<EstadoSolicitud, string> = {
      REGISTRADA: 'bg-blue-100 text-blue-700',
      CLASIFICADA: 'bg-yellow-100 text-yellow-700',
      EN_ATENCION: 'bg-orange-100 text-orange-700',
      ATENDIDA: 'bg-green-100 text-green-700',
      CERRADA: 'bg-gray-100 text-gray-500'
    };
    return map[estado] ?? 'bg-gray-100 text-gray-500';
  }
} 