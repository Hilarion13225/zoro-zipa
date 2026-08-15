package com.vitrinezoro.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Minimal health check for external uptime monitors (e.g. UptimeRobot).
 * Intentionally does nothing but return a static payload — no DB query,
 * no business logic — so it stays fast and cheap to call every few minutes,
 * and never leaks any internal/sensitive information.
 */
@RestController
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
