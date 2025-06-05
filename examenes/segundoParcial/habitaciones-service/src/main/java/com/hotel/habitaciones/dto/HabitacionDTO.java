package com.hotel.habitaciones.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitacionDTO {
    private String id;
    private String numeroHabitacion;
    private String tipoHabitacionId;
    private String estado;
    private String descripcion;
}
