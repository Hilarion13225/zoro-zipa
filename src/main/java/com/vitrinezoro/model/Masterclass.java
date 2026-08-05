package com.vitrinezoro.model;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "masterclasses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Masterclass {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String imageUrl;
    private String content;
    private String title;
    private int displayOrder;
}
