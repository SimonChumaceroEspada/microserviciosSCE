package com.hotel.habitaciones.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoHabitacionDTO {
    private String id;
    private String nombre;
    private String descripcion;
    private Double precioPorNoche;
    private Integer capacidad;
}
