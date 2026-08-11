package com.vitrinezoro.model;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "solo_shows")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SoloShow {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String year;
    private boolean featured;
}
