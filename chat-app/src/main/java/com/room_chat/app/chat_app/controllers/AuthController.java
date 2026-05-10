package com.room_chat.app.chat_app.controllers;

import com.room_chat.app.chat_app.dtos.auth.AuthRequest;
import com.room_chat.app.chat_app.dtos.auth.AuthResponse;
import com.room_chat.app.chat_app.dtos.auth.RegisterRequest;
import com.room_chat.app.chat_app.entities.User;
import com.room_chat.app.chat_app.security.JwtProvider;
import com.room_chat.app.chat_app.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    public AuthController(UserService userService,
                          AuthenticationManager authenticationManager,
                          JwtProvider jwtProvider) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.register(request);
        return ResponseEntity.ok(
                java.util.Map.of(
                        "username", user.getUsername(),
                        "roles", user.getRoles()
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            String token = jwtProvider.generateToken(authentication);
            return ResponseEntity.ok(new AuthResponse(request.getUsername(), token, "Bearer"));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}
