package com.hotel.habitaciones.controller;

import com.hotel.habitaciones.dto.HabitacionDTO;
import com.hotel.habitaciones.service.HabitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habitaciones")
public class HabitacionController {

    @Autowired
    private HabitacionService habitacionService;

    @GetMapping
    public ResponseEntity<List<HabitacionDTO>> getAllHabitaciones() {
        return ResponseEntity.ok(habitacionService.getAllHabitaciones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitacionDTO> getHabitacionById(@PathVariable String id) {
        return ResponseEntity.ok(habitacionService.getHabitacionById(id));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<HabitacionDTO>> getHabitacionesByEstado(@PathVariable String estado) {
        return ResponseEntity.ok(habitacionService.getHabitacionesByEstado(estado));
    }

    @PostMapping
    public ResponseEntity<HabitacionDTO> createHabitacion(@RequestBody HabitacionDTO habitacionDTO) {
        return new ResponseEntity<>(habitacionService.createHabitacion(habitacionDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitacionDTO> updateHabitacion(@PathVariable String id, @RequestBody HabitacionDTO habitacionDTO) {
        return ResponseEntity.ok(habitacionService.updateHabitacion(id, habitacionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabitacion(@PathVariable String id) {
        habitacionService.deleteHabitacion(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint público para consultar habitaciones disponibles
    @GetMapping("/public/disponibles")
    public ResponseEntity<List<HabitacionDTO>> getHabitacionesDisponibles() {
        return ResponseEntity.ok(habitacionService.getHabitacionesByEstado("disponible"));
    }
}
