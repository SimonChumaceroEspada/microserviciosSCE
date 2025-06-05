package com.hotel.habitaciones.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Clase para probar la generación de tokens JWT
 */
public class JwtTokenTester {

    public static void main(String[] args) {
        String secret = "hotel_jwt_secret_key";
        
        // Crear la clave de firma
        Key key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        
        // Crear claims (payload)
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", 123);
        claims.put("correo", "test@example.com");
        
        // Fecha de expiración (1 hora desde ahora)
        long currentTime = System.currentTimeMillis();
        Date issuedAt = new Date(currentTime);
        Date expiresAt = new Date(currentTime + 3600 * 1000);
        
        // Generar token
        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(issuedAt)
                .setExpiration(expiresAt)
                .signWith(key)
                .compact();
        
        System.out.println("Generated JWT Token:");
        System.out.println(token);
        
        // Verificar token para asegurarnos que funciona
        Claims parsedClaims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
                
        System.out.println("\nVerified Decoded Token:");
        System.out.println(parsedClaims);
    }
}
