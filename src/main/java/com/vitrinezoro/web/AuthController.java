package com.vitrinezoro.web;

import com.vitrinezoro.dto.Dtos.AuthResponse;
import com.vitrinezoro.dto.Dtos.LoginRequest;
import com.vitrinezoro.dto.Dtos.RegisterRequest;
import com.vitrinezoro.model.User;
import com.vitrinezoro.repository.UserRepository;
import com.vitrinezoro.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest body) {
        User user = users.findByEmail(body.email())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides"));

        if (!user.isActive() || !passwordEncoder.matches(body.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole());
    }

    /** Public self-registration — always creates a CLIENT account, never ADMIN. */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody RegisterRequest body) {
        if (users.existsByEmail(body.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email est déjà utilisé");
        }

        User user = User.builder()
            .name(body.name())
            .email(body.email())
            .password(passwordEncoder.encode(body.password()))
            .role(User.Role.CLIENT)
            .active(true)
            .createdAt(LocalDate.now())
            .build();
        users.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getName(), user.getEmail(), user.getRole());
    }
}
