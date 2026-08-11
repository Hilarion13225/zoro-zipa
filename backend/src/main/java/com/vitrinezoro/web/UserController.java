package com.vitrinezoro.web;

import com.vitrinezoro.dto.Dtos.UserDto;
import com.vitrinezoro.model.User;
import com.vitrinezoro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<UserDto> list() {
        return users.findAll().stream().map(UserDto::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto create(@RequestBody CreateUserRequest body) {
        if (users.existsByEmail(body.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email est déjà utilisé");
        }
        User user = User.builder()
            .name(body.name())
            .email(body.email())
            .password(passwordEncoder.encode(body.password()))
            .role(body.role() != null ? body.role() : User.Role.CLIENT)
            .active(true)
            .createdAt(LocalDate.now())
            .build();
        return UserDto.from(users.save(user));
    }

    @PutMapping("/{id}")
    public UserDto update(@PathVariable Long id, @RequestBody CreateUserRequest body) {
        User user = users.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.name() != null) user.setName(body.name());
        if (body.email() != null) user.setEmail(body.email());
        if (body.role() != null) user.setRole(body.role());
        if (body.password() != null && !body.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(body.password()));
        }
        user.setActive(body.active());
        return UserDto.from(users.save(user));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        users.deleteById(id);
    }

    /** Separate from UserDto so we never accidentally serialize a password hash back out. */
    public record CreateUserRequest(
        String name, String email, String password, User.Role role, boolean active) {}
}
