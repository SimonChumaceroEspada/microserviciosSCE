package com.hotel.habitaciones.repository;

import com.hotel.habitaciones.model.TipoHabitacion;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface TipoHabitacionRepository extends MongoRepository<TipoHabitacion, String> {
    Optional<TipoHabitacion> findByNombre(String nombre);
}
