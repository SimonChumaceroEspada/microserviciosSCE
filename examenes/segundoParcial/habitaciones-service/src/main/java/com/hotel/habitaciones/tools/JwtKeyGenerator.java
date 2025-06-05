package com.hotel.habitaciones.tools;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Herramienta para generar y mostrar información de claves JWT
 */
public class JwtKeyGenerator {
    
    public static void main(String[] args) {
        String secretKey = "hotel_jwt_secret_key";
        
        System.out.println("==== Información de clave JWT ====");
        System.out.println("Clave secreta original: " + secretKey);
        System.out.println("Longitud en caracteres: " + secretKey.length());
        System.out.println("Longitud en bytes: " + secretKey.getBytes(StandardCharsets.UTF_8).length);
        System.out.println("Longitud en bits: " + (secretKey.getBytes(StandardCharsets.UTF_8).length * 8));
        
        System.out.println("\n==== Versión mejorada de la clave (SHA-256) ====");
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(secretKey.getBytes(StandardCharsets.UTF_8));
            
            System.out.println("SHA-256 hash (hex): " + bytesToHex(hashBytes));
            System.out.println("Longitud en bytes: " + hashBytes.length);
            System.out.println("Longitud en bits: " + (hashBytes.length * 8));
            
            String base64Key = Base64.getEncoder().encodeToString(hashBytes);
            System.out.println("Base64 key: " + base64Key);
            
            // Crear clave HMAC-SHA usando la librería JWT
            Key key = Keys.hmacShaKeyFor(hashBytes);
            System.out.println("Algoritmo de la clave: " + key.getAlgorithm());
            System.out.println("Formato de la clave: " + key.getFormat());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        
        System.out.println("\n==== Clave generada directamente por la librería JWT ====");
        Key generatedKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        byte[] keyBytes = generatedKey.getEncoded();
        String encodedKey = Base64.getEncoder().encodeToString(keyBytes);
        System.out.println("Base64 key: " + encodedKey);
        System.out.println("Longitud en bytes: " + keyBytes.length);
        System.out.println("Longitud en bits: " + (keyBytes.length * 8));
    }
    
    private static String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
}
