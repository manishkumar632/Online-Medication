package com.medsync.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.medsync.backend.model.Doctor;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
}