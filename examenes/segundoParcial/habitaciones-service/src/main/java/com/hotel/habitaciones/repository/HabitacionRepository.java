package com.hotel.habitaciones.repository;

import com.hotel.habitaciones.model.Habitacion;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface HabitacionRepository extends MongoRepository<Habitacion, String> {
    Optional<Habitacion> findByNumeroHabitacion(String numeroHabitacion);
    List<Habitacion> findByEstado(String estado);
    List<Habitacion> findByTipoHabitacionId(String tipoHabitacionId);
}
