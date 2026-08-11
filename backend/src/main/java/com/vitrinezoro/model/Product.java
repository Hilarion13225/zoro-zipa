package com.vitrinezoro.model;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private double price;
    private int quantity;
    private String category;
    private boolean available;
}
