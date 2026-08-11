package com.vitrinezoro.service;

import com.vitrinezoro.model.Reservation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.admin:bruno488@gmail.com}")
    private String adminEmail;

    @Value("${spring.mail.from:noreply@zorozipa.com}")
    private String fromEmail;

    public void sendReservationConfirmation(Reservation reservation) {
        try {
            sendToVisitor(reservation);
            sendToAdmin(reservation);
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de l'email de réservation", e);
        }
    }

    private void sendToVisitor(Reservation reservation) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(reservation.getEmail());
        message.setSubject("Votre réservation chez Zoro Zipa - " + reservation.getCode());

        String body = String.format(
            "Bonjour %s,\n\n" +
            "Votre réservation a été confirmée!\n\n" +
            "Exposition: %s\n" +
            "Date: %s\n" +
            "Horaire: %s\n" +
            "Nombre de visiteurs: %d\n" +
            "Code de réservation: %s\n\n" +
            "Présentez ce code QR à l'entrée.\n\n" +
            "Merci,\nZoro Zipa",
            reservation.getFullName(),
            reservation.getExhibition().getTitle(),
            reservation.getVisitDate(),
            reservation.getTimeSlot(),
            reservation.getVisitors(),
            reservation.getCode());

        message.setText(body);
        mailSender.send(message);
    }

    private void sendToAdmin(Reservation reservation) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(adminEmail);
        message.setSubject("Nouvelle réservation - " + reservation.getFullName());

        String body = String.format(
            "Nouvelle réservation pour Zoro Zipa\n\n" +
            "Nom: %s\n" +
            "Email: %s\n" +
            "Téléphone: %s\n" +
            "Exposition: %s\n" +
            "Date: %s\n" +
            "Horaire: %s\n" +
            "Nombre de visiteurs: %d\n" +
            "Code: %s",
            reservation.getFullName(),
            reservation.getEmail(),
            reservation.getPhone(),
            reservation.getExhibition().getTitle(),
            reservation.getVisitDate(),
            reservation.getTimeSlot(),
            reservation.getVisitors(),
            reservation.getCode());

        message.setText(body);
        mailSender.send(message);
    }
}
