package com.vitrinezoro.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "exhibitions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Exhibition {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;
}