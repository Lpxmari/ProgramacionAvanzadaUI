export interface EstudianteDTO {
  id: number;
  nombreCompleto: string;
  correo: string;
  programa: string;
}

export interface ResponsableDTO {
  id: number;
  nombreCompleto: string;
  cargo: string;
  activo: boolean;
}