package com.medsync.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.medsync.backend.repository.*;
import com.medsync.backend.model.*;

@RestController
@RequestMapping("/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final PrescriptionRepository prescriptionRepository;

    @PostMapping("/register")
    public Doctor register(@RequestBody Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @PostMapping("/prescription")
    public Prescription createPrescription(@RequestBody Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    @PutMapping("/prescription/{id}")
    public Prescription updatePrescription(@PathVariable Long id,
                                           @RequestBody Prescription updated) {

        Prescription p = prescriptionRepository.findById(id).orElseThrow();

        p.setMedicationName(updated.getMedicationName());
        p.setDosage(updated.getDosage());
        p.setDuration(updated.getDuration());
        p.setInstructions(updated.getInstructions());
        p.setExpiryDate(updated.getExpiryDate());
        p.setVersion(p.getVersion() + 1);

        return prescriptionRepository.save(p);
    }
}