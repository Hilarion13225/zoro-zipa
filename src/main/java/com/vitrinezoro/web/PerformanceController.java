package com.vitrinezoro.web;
import com.vitrinezoro.model.Performance;
import com.vitrinezoro.repository.PerformanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/performances") @RequiredArgsConstructor
public class PerformanceController {
    private final PerformanceRepository repo;
    @GetMapping public List<Performance> list() { return repo.findAll(); }
    @PostMapping public Performance create(@RequestBody Performance body) { return repo.save(body); }
    @PutMapping("/{id}") public Performance update(@PathVariable Long id, @RequestBody Performance body) {
        Performance e = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.getTitle() != null) e.setTitle(body.getTitle());
        return repo.save(e);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
