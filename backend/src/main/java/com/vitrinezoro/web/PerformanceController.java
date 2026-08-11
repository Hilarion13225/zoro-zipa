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
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Performance create(@RequestBody Performance body) { return repo.save(body); }
    @PutMapping("/{id}") public Performance update(@PathVariable Long id, @RequestBody Performance body) {
        Performance e = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.getTitle() != null) e.setTitle(body.getTitle());
        if (body.getDescription() != null) e.setDescription(body.getDescription());
        if (body.getImageUrl() != null) e.setImageUrl(body.getImageUrl());
        if (body.getDate() != null) e.setDate(body.getDate());
        if (body.getLocation() != null) e.setLocation(body.getLocation());
        e.setFeatured(body.isFeatured());
        return repo.save(e);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
