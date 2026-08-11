package com.vitrinezoro.repository;
import com.vitrinezoro.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProductRepository extends JpaRepository<Product, Long> {}
