package com.hotel.habitaciones.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tipos_habitacion")
public class TipoHabitacion {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String nombre;
    
    private String descripcion;
    private Double precioPorNoche;
    private Integer capacidad;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
