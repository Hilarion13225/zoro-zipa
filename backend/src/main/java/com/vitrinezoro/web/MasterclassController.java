package com.vitrinezoro.web;
import com.vitrinezoro.model.Masterclass;
import com.vitrinezoro.repository.MasterclassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/masterclasses") @RequiredArgsConstructor
public class MasterclassController {
    private final MasterclassRepository repo;
    @GetMapping public List<Masterclass> list() { return repo.findAll(); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Masterclass create(@RequestBody Masterclass body) { return repo.save(body); }
    @PutMapping("/{id}") public Masterclass update(@PathVariable Long id, @RequestBody Masterclass body) {
        Masterclass e = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.getTitle() != null) e.setTitle(body.getTitle());
        if (body.getImageUrl() != null) e.setImageUrl(body.getImageUrl());
        if (body.getContent() != null) e.setContent(body.getContent());
        e.setDisplayOrder(body.getDisplayOrder());
        return repo.save(e);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
