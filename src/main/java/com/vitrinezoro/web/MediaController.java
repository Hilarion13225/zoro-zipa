package com.vitrinezoro.web;
import com.vitrinezoro.model.Media;
import com.vitrinezoro.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/media") @RequiredArgsConstructor
public class MediaController {
    private final MediaRepository repo;
    @GetMapping public List<Media> list() { return repo.findAll(); }
    @PostMapping public Media create(@RequestBody Media body) { return repo.save(body); }
    @PutMapping("/{id}") public Media update(@PathVariable Long id, @RequestBody Media body) {
        Media e = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.getTitle() != null) e.setTitle(body.getTitle());
        return repo.save(e);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
