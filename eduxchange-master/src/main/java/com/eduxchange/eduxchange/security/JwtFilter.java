package com.eduxchange.eduxchange.security;

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

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String requestPath = request.getRequestURI();
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        System.out.println("🔍 Incoming request: " + requestPath);

        // ✅ Extract JWT
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);

            try {
                username = jwtUtil.extractUsername(jwt);
                System.out.println("✅ Extracted username: " + username);
            } catch (Exception e) {
                System.out.println("❌ JWT extraction failed: " + e.getMessage());
            }
        } else {
            System.out.println("⚠️ No Authorization header or invalid format");
        }

        // ✅ Validate and set authentication
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("👤 Loaded user: " + userDetails.getUsername());

                boolean isValid = jwtUtil.validateToken(jwt, userDetails);
                System.out.println("🔐 Token valid: " + isValid);

                if (isValid) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("✅ Authentication set in SecurityContext");
                } else {
                    System.out.println("❌ Token validation failed");
                }

            } catch (Exception e) {
                System.out.println("❌ Error during authentication: " + e.getMessage());
            }
        }

        // ✅ Continue filter chain
        filterChain.doFilter(request, response);
    }
}
