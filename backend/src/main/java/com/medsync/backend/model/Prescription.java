package com.medsync.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String medicationName;
    private String dosage;
    private String duration;
    private String instructions;

    private int version = 1;

    private LocalDate expiryDate;

    @ManyToOne
    private Doctor doctor;
}