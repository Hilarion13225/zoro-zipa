package com.vitrinezoro.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long productId;
    private String productTitle;
    private double price;
    private int quantity;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String status; // PENDING, CONFIRMED, SHIPPED, DELIVERED
    private LocalDate orderDate;
}
