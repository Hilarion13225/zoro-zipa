package com.vitrinezoro.config;

import com.vitrinezoro.model.*;
import com.vitrinezoro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/** Seeds the catalogue on first start so the platform is immediately usable. */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ArtistRepository artists;
    private final ArtworkRepository artworks;
    private final GalleryRepository galleries;
    private final ExhibitionRepository exhibitions;
    private final ReservationRepository reservations;
    private final UserRepository users;

    private static String unsplash(String id) {
        return "https://images.unsplash.com/" + id + "?q=80&w=1600&auto=format&fit=crop";
    }

    private static String local(String filename) {
        return "/uploads/" + filename;
    }

    @Override
    public void run(String... args) {
        if (artists.count() > 0) return;

        Artist zoro = artist("Zoro Zipa", local("image00002.jpeg"), "Ivoirien",
            "Urban Art",
            "Kouassi Konan - Zoro Zipa est un artiste urbain ivoirien dont l'art capture l'essence de la vie citadine avec des couleurs vibrantes et des formes dynamiques.",
            "Zoro Zipa transforme les murs et les espaces urbains en galeries à ciel ouvert. Son travail explore la tension entre tradition et modernité à travers des compositions audacieuses et engagées. Chaque pièce raconte une histoire de la ville contemporaine africaine.");
        List<Artist> allArtists = artists.saveAll(List.of(zoro));

        Gallery main = gallery("Zoro Zipa Gallery", "Abidjan",
            "Plateau, Rue de l'Art Urbain",
            "Galerie dédiée aux œuvres urbaines et contemporaines de Zoro Zipa. Un espace de création et de partage de l'art urbain africain.",
            "photo-1577720580479-7d839d829c73", true);
        galleries.saveAll(List.of(main));

        artworks.saveAll(List.of(
            artwork("Vibrations Urbaines", zoro, "Urban Art", "Spray et acrylique sur toile", "200 × 150 cm", 2024, true, 542,
                "Une explosion de couleurs et de formes géométriques qui capture l'énergie brute de la vie urbaine abidjanaise.",
                local("image00001.jpeg")),
            artwork("Rues de Lumière", zoro, "Urban Art", "Spray et techniques mixtes", "180 × 120 cm", 2024, true, 428,
                "Les ruelles d'Abidjan illuminées par la nuit, peintes avec des couleurs éclatantes et une dynamique captivante.",
                local("image00002.jpeg")),
            artwork("Cité en Mouvement", zoro, "Urban Art", "Acrylique et spray", "220 × 140 cm", 2024, true, 387,
                "Une représentation poétique du flux constant des villes africaines, où tradition et modernité dansent ensemble.",
                local("image00003.jpeg")),
            artwork("Écho Urbain", zoro, "Urban Art", "Spray et peinture sur toile", "160 × 120 cm", 2024, true, 295,
                "Les voix de la ville résonnent dans cette composition abstraite urbaine, où chaque coup de pinceau raconte une histoire.",
                local("image00004.jpeg"))));

        LocalDate today = LocalDate.now();
        Exhibition zoroExpo = exhibition("Zoro Zipa - Urban Art", main, "Abidjan, Plateau",
            "Exposition exclusive des œuvres urbaines de Zoro Zipa. Une célébration de l'art urbain africain à travers ses compositions vibrantes et engagées.",
            "photo-1518998053901-5348d3961a04", today.minusDays(10), today.plusDays(60),
            List.of(zoro));
        exhibitions.saveAll(List.of(zoroExpo));

        users.saveAll(List.of(
            user("Zoro Zipa", "contact@zorozipa.com", User.Role.ADMIN),
            user("Kouassi Konan", "kouassi@zorozipa.com", User.Role.GALLERY)));

        reservations.saveAll(List.of(
            reservation(zoroExpo, today.plusDays(5), "10:00", 2, "Visiteur", "visitor@zorozipa.com", "+225 01 23 45 67"),
            reservation(zoroExpo, today.plusDays(15), "14:00", 1, "Collectionneur", "collector@zorozipa.com", "+225 98 76 54 32")));
    }

    private Artist artist(String name, String photo, String nationality, String style, String bio, String journey) {
        String url = photo.startsWith("/") ? photo : unsplash(photo);
        return Artist.builder()
            .name(name)
            .portraitUrl(url)
            .nationality(nationality)
            .style(style)
            .bio(bio)
            .journey(journey)
            .status(Artist.Status.VALIDATED)
            .build();
    }

    private Gallery gallery(String name, String city, String address, String description, String photo, boolean partner) {
        String url = photo.startsWith("/") ? photo : unsplash(photo);
        return Gallery.builder()
            .name(name)
            .city(city)
            .address(address)
            .description(description)
            .imageUrl(url)
            .partner(partner)
            .build();
    }

    private Artwork artwork(String title, Artist artist, String category, String technique,
                            String dimensions, int year, boolean trending, long views,
                            String description, String photo) {
        String url = photo.startsWith("/") ? photo : unsplash(photo);
        return Artwork.builder()
            .title(title)
            .artist(artist)
            .category(category)
            .technique(technique)
            .dimensions(dimensions)
            .yearCreated(year)
            .trending(trending)
            .views(views)
            .description(description)
            .imageUrl(url)
            .images(List.of(url))
            .build();
    }

    private Exhibition exhibition(String title, Gallery gallery, String location, String description,
                                  String photo, LocalDate start, LocalDate end, List<Artist> artists) {
        return Exhibition.builder()
            .title(title)
            .gallery(gallery)
            .location(location)
            .description(description)
            .posterUrl(unsplash(photo))
            .startDate(start)
            .endDate(end)
            .artists(artists)
            .build();
    }

    private User user(String name, String email, User.Role role) {
        return User.builder()
            .name(name)
            .email(email)
            .role(role)
            .active(true)
            .createdAt(LocalDate.now().minusDays(30))
            .build();
    }

    private Reservation reservation(Exhibition exhibition, LocalDate date, String slot,
                                    int visitors, String fullName, String email, String phone) {
        return Reservation.builder()
            .exhibition(exhibition)
            .visitDate(date)
            .timeSlot(slot)
            .visitors(visitors)
            .fullName(fullName)
            .email(email)
            .phone(phone)
            .status(Reservation.Status.CONFIRMED)
            .code("ZZ-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase())
            .build();
    }
}
