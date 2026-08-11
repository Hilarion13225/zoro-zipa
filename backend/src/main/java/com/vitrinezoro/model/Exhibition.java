package com.vitrinezoro.model;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "exhibitions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Exhibition {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String location;
    private String dates;
    private boolean active;
}
