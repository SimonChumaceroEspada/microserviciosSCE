package com.hotel.habitaciones.service;

import com.hotel.habitaciones.dto.HabitacionDTO;
import com.hotel.habitaciones.exception.ResourceNotFoundException;
import com.hotel.habitaciones.model.Habitacion;
import com.hotel.habitaciones.repository.HabitacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HabitacionService {

    @Autowired
    private HabitacionRepository habitacionRepository;

    public List<HabitacionDTO> getAllHabitaciones() {
        return habitacionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public HabitacionDTO getHabitacionById(String id) {
        Habitacion habitacion = habitacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada con id: " + id));
        return convertToDTO(habitacion);
    }

    public List<HabitacionDTO> getHabitacionesByEstado(String estado) {
        return habitacionRepository.findByEstado(estado).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public HabitacionDTO createHabitacion(HabitacionDTO habitacionDTO) {
        Habitacion habitacion = convertToEntity(habitacionDTO);
        habitacion.setCreatedAt(LocalDateTime.now());
        habitacion.setUpdatedAt(LocalDateTime.now());
        return convertToDTO(habitacionRepository.save(habitacion));
    }

    public HabitacionDTO updateHabitacion(String id, HabitacionDTO habitacionDTO) {
        Habitacion existingHabitacion = habitacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Habitación no encontrada con id: " + id));

        existingHabitacion.setNumeroHabitacion(habitacionDTO.getNumeroHabitacion());
        existingHabitacion.setTipoHabitacionId(habitacionDTO.getTipoHabitacionId());
        existingHabitacion.setEstado(habitacionDTO.getEstado());
        existingHabitacion.setDescripcion(habitacionDTO.getDescripcion());
        existingHabitacion.setUpdatedAt(LocalDateTime.now());

        return convertToDTO(habitacionRepository.save(existingHabitacion));
    }

    public void deleteHabitacion(String id) {
        if (!habitacionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Habitación no encontrada con id: " + id);
        }
        habitacionRepository.deleteById(id);
    }

    private HabitacionDTO convertToDTO(Habitacion habitacion) {
        HabitacionDTO dto = new HabitacionDTO();
        dto.setId(habitacion.getId());
        dto.setNumeroHabitacion(habitacion.getNumeroHabitacion());
        dto.setTipoHabitacionId(habitacion.getTipoHabitacionId());
        dto.setEstado(habitacion.getEstado());
        dto.setDescripcion(habitacion.getDescripcion());
        return dto;
    }

    private Habitacion convertToEntity(HabitacionDTO dto) {
        Habitacion habitacion = new Habitacion();
        habitacion.setNumeroHabitacion(dto.getNumeroHabitacion());
        habitacion.setTipoHabitacionId(dto.getTipoHabitacionId());
        habitacion.setEstado(dto.getEstado());
        habitacion.setDescripcion(dto.getDescripcion());
        return habitacion;
    }
}
