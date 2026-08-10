package com.vitrinezoro.web;
import com.vitrinezoro.model.SoloShow;
import com.vitrinezoro.repository.SoloShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/solo-shows") @RequiredArgsConstructor
public class SoloShowController {
    private final SoloShowRepository repo;
    @GetMapping public List<SoloShow> list() { return repo.findAll(); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public SoloShow create(@RequestBody SoloShow body) { return repo.save(body); }
    @PutMapping("/{id}") public SoloShow update(@PathVariable Long id, @RequestBody SoloShow body) {
        SoloShow e = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.getTitle() != null) e.setTitle(body.getTitle());
        if (body.getDescription() != null) e.setDescription(body.getDescription());
        if (body.getImageUrl() != null) e.setImageUrl(body.getImageUrl());
        e.setYear(body.getYear());
        e.setFeatured(body.isFeatured());
        return repo.save(e);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
