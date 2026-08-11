package com.vitrinezoro.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "purchase_orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PurchaseOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private Long productId;
    private String productTitle;
    private double price;
    private int quantity;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String status;
    private LocalDate orderDate;
}
