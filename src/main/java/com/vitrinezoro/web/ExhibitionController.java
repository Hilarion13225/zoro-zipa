package com.vitrinezoro.web;
import com.vitrinezoro.model.Exhibition;
import com.vitrinezoro.repository.ExhibitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/exhibitions") @RequiredArgsConstructor
public class ExhibitionController {
    private final ExhibitionRepository repo;
    @GetMapping public List<Exhibition> list() { return repo.findAll(); }
    @PostMapping public Exhibition create(@RequestBody Exhibition body) { return repo.save(body); }
    @PutMapping("/{id}") public Exhibition update(@PathVariable Long id, @RequestBody Exhibition body) {
        Exhibition e = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.getTitle() != null) e.setTitle(body.getTitle());
        if (body.getDescription() != null) e.setDescription(body.getDescription());
        if (body.getImageUrl() != null) e.setImageUrl(body.getImageUrl());
        if (body.getLocation() != null) e.setLocation(body.getLocation());
        if (body.getDates() != null) e.setDates(body.getDates());
        e.setActive(body.isActive());
        return repo.save(e);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
