package com.vitrinezoro.model;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "performances")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Performance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String date;
    private String location;
    private boolean featured;
}
