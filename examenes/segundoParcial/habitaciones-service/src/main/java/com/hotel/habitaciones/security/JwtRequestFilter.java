package com.hotel.habitaciones.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String requestTokenHeader = request.getHeader("Authorization");
        logger.info("URL solicitada: " + request.getRequestURI());
        logger.info("Header de autorización recibido: " + requestTokenHeader);

        String username = null;
        String jwtToken = null;

        // JWT Token está en el formato "Bearer token". Quitar "Bearer " y tomar el token
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtTokenUtil.getUsernameFromToken(jwtToken);
                logger.info("Token JWT procesado correctamente para el usuario: " + username);
            } catch (Exception e) {
                logger.error("Error procesando el JWT token: " + e.getMessage(), e);
            }
        } else {
            logger.warn("JWT Token no comienza con Bearer String o es nulo");
        }

        // Una vez que tenemos el token, validamos
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        // Crear objeto UserDetails para proceder con la autenticación
            // El email/correo es el username en este contexto
            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                    username, "", new ArrayList<>());
                    
            logger.info("JWT Token contenido del claim: " + username);

            // Si el token es válido, configuramos Spring Security para usar manualmente
            if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Después de configurar la autenticación, especificar que el usuario actual está autenticado
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        chain.doFilter(request, response);
    }
}
