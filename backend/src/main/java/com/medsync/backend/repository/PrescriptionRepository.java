package com.medsync.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.medsync.backend.model.Prescription;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
}