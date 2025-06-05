package com.hotel.habitaciones.service;

import com.hotel.habitaciones.dto.TipoHabitacionDTO;
import com.hotel.habitaciones.exception.ResourceNotFoundException;
import com.hotel.habitaciones.model.TipoHabitacion;
import com.hotel.habitaciones.repository.TipoHabitacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TipoHabitacionService {

    @Autowired
    private TipoHabitacionRepository tipoHabitacionRepository;

    public List<TipoHabitacionDTO> getAllTiposHabitacion() {
        return tipoHabitacionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TipoHabitacionDTO getTipoHabitacionById(String id) {
        TipoHabitacion tipoHabitacion = tipoHabitacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de habitación no encontrado con id: " + id));
        return convertToDTO(tipoHabitacion);
    }

    public TipoHabitacionDTO createTipoHabitacion(TipoHabitacionDTO tipoHabitacionDTO) {
        TipoHabitacion tipoHabitacion = convertToEntity(tipoHabitacionDTO);
        tipoHabitacion.setCreatedAt(LocalDateTime.now());
        tipoHabitacion.setUpdatedAt(LocalDateTime.now());
        return convertToDTO(tipoHabitacionRepository.save(tipoHabitacion));
    }

    public TipoHabitacionDTO updateTipoHabitacion(String id, TipoHabitacionDTO tipoHabitacionDTO) {
        TipoHabitacion existingTipoHabitacion = tipoHabitacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de habitación no encontrado con id: " + id));

        existingTipoHabitacion.setNombre(tipoHabitacionDTO.getNombre());
        existingTipoHabitacion.setDescripcion(tipoHabitacionDTO.getDescripcion());
        existingTipoHabitacion.setPrecioPorNoche(tipoHabitacionDTO.getPrecioPorNoche());
        existingTipoHabitacion.setCapacidad(tipoHabitacionDTO.getCapacidad());
        existingTipoHabitacion.setUpdatedAt(LocalDateTime.now());

        return convertToDTO(tipoHabitacionRepository.save(existingTipoHabitacion));
    }

    public void deleteTipoHabitacion(String id) {
        if (!tipoHabitacionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tipo de habitación no encontrado con id: " + id);
        }
        tipoHabitacionRepository.deleteById(id);
    }

    private TipoHabitacionDTO convertToDTO(TipoHabitacion tipoHabitacion) {
        TipoHabitacionDTO dto = new TipoHabitacionDTO();
        dto.setId(tipoHabitacion.getId());
        dto.setNombre(tipoHabitacion.getNombre());
        dto.setDescripcion(tipoHabitacion.getDescripcion());
        dto.setPrecioPorNoche(tipoHabitacion.getPrecioPorNoche());
        dto.setCapacidad(tipoHabitacion.getCapacidad());
        return dto;
    }

    private TipoHabitacion convertToEntity(TipoHabitacionDTO dto) {
        TipoHabitacion tipoHabitacion = new TipoHabitacion();
        tipoHabitacion.setNombre(dto.getNombre());
        tipoHabitacion.setDescripcion(dto.getDescripcion());
        tipoHabitacion.setPrecioPorNoche(dto.getPrecioPorNoche());
        tipoHabitacion.setCapacidad(dto.getCapacidad());
        return tipoHabitacion;
    }
}
