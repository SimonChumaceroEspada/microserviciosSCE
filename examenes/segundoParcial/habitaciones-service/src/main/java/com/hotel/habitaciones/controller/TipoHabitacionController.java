package com.hotel.habitaciones.controller;

import com.hotel.habitaciones.dto.TipoHabitacionDTO;
import com.hotel.habitaciones.service.TipoHabitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-habitacion")
public class TipoHabitacionController {

    @Autowired
    private TipoHabitacionService tipoHabitacionService;

    @GetMapping
    public ResponseEntity<List<TipoHabitacionDTO>> getAllTiposHabitacion() {
        return ResponseEntity.ok(tipoHabitacionService.getAllTiposHabitacion());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoHabitacionDTO> getTipoHabitacionById(@PathVariable String id) {
        return ResponseEntity.ok(tipoHabitacionService.getTipoHabitacionById(id));
    }

    @PostMapping
    public ResponseEntity<TipoHabitacionDTO> createTipoHabitacion(@RequestBody TipoHabitacionDTO tipoHabitacionDTO) {
        return new ResponseEntity<>(tipoHabitacionService.createTipoHabitacion(tipoHabitacionDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoHabitacionDTO> updateTipoHabitacion(@PathVariable String id, @RequestBody TipoHabitacionDTO tipoHabitacionDTO) {
        return ResponseEntity.ok(tipoHabitacionService.updateTipoHabitacion(id, tipoHabitacionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTipoHabitacion(@PathVariable String id) {
        tipoHabitacionService.deleteTipoHabitacion(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint público para consultar tipos de habitación
    @GetMapping("/public")
    public ResponseEntity<List<TipoHabitacionDTO>> getPublicTiposHabitacion() {
        return ResponseEntity.ok(tipoHabitacionService.getAllTiposHabitacion());
    }
}
