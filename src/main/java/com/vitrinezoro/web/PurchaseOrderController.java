package com.vitrinezoro.web;
import com.vitrinezoro.model.PurchaseOrder;
import com.vitrinezoro.repository.PurchaseOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/orders") @RequiredArgsConstructor
public class PurchaseOrderController {
    private final PurchaseOrderRepository repo;
    @GetMapping public List<PurchaseOrder> list() { return repo.findAll(); }
    @PostMapping public PurchaseOrder create(@RequestBody PurchaseOrder body) { return repo.save(body); }
    @PutMapping("/{id}") public PurchaseOrder update(@PathVariable Long id, @RequestBody PurchaseOrder body) {
        PurchaseOrder e = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (body.getTitle() != null) e.setTitle(body.getTitle());
        return repo.save(e);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
