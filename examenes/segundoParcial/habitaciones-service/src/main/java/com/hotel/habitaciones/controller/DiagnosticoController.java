package com.hotel.habitaciones.controller;

import com.hotel.habitaciones.security.JwtTokenUtil;
import com.hotel.habitaciones.service.HabitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador para diagnóstico y pruebas de autenticación
 */
@RestController
@RequestMapping("/api/diagnostico")
public class DiagnosticoController {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private HabitacionService habitacionService;
    
    @GetMapping("/token")
    public ResponseEntity<?> diagnosticarToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> respuesta = new HashMap<>();
        
        if (authHeader == null) {
            respuesta.put("error", "No se recibió el header Authorization");
            return ResponseEntity.ok(respuesta);
        }
        
        if (!authHeader.startsWith("Bearer ")) {
            respuesta.put("error", "El header no comienza con 'Bearer '");
            respuesta.put("headerRecibido", authHeader);
            return ResponseEntity.ok(respuesta);
        }
        
        String token = authHeader.substring(7);
        respuesta.put("tokenRecibido", token);
        respuesta.put("longitudToken", token.length());
        
        // Dividir el token por partes
        String[] partes = token.split("\\.");
        respuesta.put("numeroDePiezas", partes.length);
        
        if (partes.length == 3) {
            respuesta.put("header", partes[0]);
            respuesta.put("payload", partes[1]);
            respuesta.put("firma", partes[2]);
            respuesta.put("formatoValido", true);
            
            // Intentar validar el token utilizando JwtTokenUtil
            try {
                respuesta.put("validacionInterna", "Iniciando validación");
                
                String username = jwtTokenUtil.getUsernameFromToken(token);
                respuesta.put("usuarioExtraido", username);
                
                // Crear objeto UserDetails para validar
                User userDetails = new User(username, "", new ArrayList<>());
                
                boolean tokenValido = jwtTokenUtil.validateToken(token, userDetails);
                respuesta.put("tokenValido", tokenValido);
            } catch (Exception e) {
                respuesta.put("errorValidacion", e.getMessage());
                respuesta.put("tipoError", e.getClass().getName());
            }
        } else {
            respuesta.put("formatoValido", false);
        }
        
        return ResponseEntity.ok(respuesta);
    }
    
    @GetMapping("/public/prueba")
    public ResponseEntity<?> rutaPublica() {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Ruta pública accesible correctamente");
        return ResponseEntity.ok(respuesta);
    }
    
    @GetMapping("/habitaciones-test")
    public ResponseEntity<?> probarHabitaciones(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> respuesta = new HashMap<>();
        
        try {
            respuesta.put("mensaje", "Endpoint de diagnóstico para habitaciones");
            respuesta.put("headerAutorizacion", authHeader);
            
            // Simular el comportamiento del filtro JWT
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                respuesta.put("tokenExtractado", "OK");
                
                try {
                    // Verificar el token
                    String username = jwtTokenUtil.getUsernameFromToken(token);
                    respuesta.put("usuarioExtraido", username);
                    
                    // Obtener habitaciones para probar el servicio
                    int count = habitacionService.getAllHabitaciones().size();
                    respuesta.put("conteoHabitaciones", count);
                    respuesta.put("accesoServicio", "OK");
                } catch (Exception e) {
                    respuesta.put("errorServicio", e.getMessage());
                }
            } else {
                respuesta.put("error", "Header de autorización no válido");
            }
        } catch (Exception e) {
            respuesta.put("error", e.getMessage());
            respuesta.put("tipoError", e.getClass().getName());
        }
        
        return ResponseEntity.ok(respuesta);
    }
    
    @GetMapping("/corstest")
    public ResponseEntity<?> corsTest() {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Prueba de CORS exitosa");
        return ResponseEntity.ok(respuesta);
    }
}
