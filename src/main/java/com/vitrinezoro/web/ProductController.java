package com.vitrinezoro.web;
import com.vitrinezoro.model.Product;
import com.vitrinezoro.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/products") @RequiredArgsConstructor
public class ProductController {
    private final ProductRepository repo;
    @GetMapping public List<Product> list() { return repo.findAll(); }
    @PostMapping public Product create(@RequestBody Product body) { return repo.save(body); }
    @PutMapping("/{id}") public Product update(@PathVariable Long id, @RequestBody Product body) {
        Product e = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.getTitle() != null) e.setTitle(body.getTitle());
        if (body.getDescription() != null) e.setDescription(body.getDescription());
        if (body.getImageUrl() != null) e.setImageUrl(body.getImageUrl());
        e.setPrice(body.getPrice());
        e.setQuantity(body.getQuantity());
        if (body.getCategory() != null) e.setCategory(body.getCategory());
        e.setAvailable(body.isAvailable());
        return repo.save(e);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
