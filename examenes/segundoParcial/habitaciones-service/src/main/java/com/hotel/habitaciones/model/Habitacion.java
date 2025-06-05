package com.hotel.habitaciones.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "habitaciones")
public class Habitacion {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String numeroHabitacion;
    
    private String tipoHabitacionId;
    
    private String estado; // disponible, ocupada, en mantenimiento
    
    private String descripcion;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
