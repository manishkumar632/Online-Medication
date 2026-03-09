# online-medication
Online Medication &amp; Prescription


medsyncpro/
├─ actions/
│  ├─ adminAction.js
│  ├─ appointmentAction.js
│  ├─ authAction.js
│  ├─ axios.ts
│  ├─ doctorAction.js
│  ├─ doctorVerificationAction.js
│  ├─ documentTypeAction.js
│  ├─ Finddoctoraction.js
│  ├─ medicationAction.js
│  ├─ messageAction.js
│  ├─ notificationAction.js
│  ├─ patientAction.js
│  ├─ pharmacyAction.js
│  ├─ response.ts
│  └─ verificationAction.js
├─ app/
│  ├─ (root)/
│  │  └─ page.jsx
│  ├─ admin/
│  │  ├─ dashboard/
│  │  │  ├─ components/
│  │  │  │  ├─ ActivityPanel.jsx
│  │  │  │  ├─ AdminNavbar.jsx
│  │  │  │  ├─ AdminSidebar.jsx
│  │  │  │  ├─ AnalyticsCharts.jsx
│  │  │  │  ├─ ApprovalQueue.jsx
│  │  │  │  ├─ KpiCards.jsx
│  │  │  │  └─ RoleManagement.jsx
│  │  │  └─ page.jsx
│  │  ├─ doctors/
│  │  │  ├─ doctors.css
│  │  │  └─ page.jsx
│  │  ├─ notifications/
│  │  │  └─ page.jsx
│  │  ├─ patients/
│  │  │  ├─ page.jsx
│  │  │  └─ patients.css
│  │  ├─ pharmacists/
│  │  │  ├─ page.jsx
│  │  │  └─ pharmacists.css
│  │  ├─ settings/
│  │  │  ├─ page.jsx
│  │  │  └─ settings.css
│  │  ├─ verifications/
│  │  │  └─ details/
│  │  │     └─ page.jsx
│  │  ├─ admin-dashboard.css
│  │  └─ layout.jsx
│  ├─ agent/
│  │  ├─ dashboard/
│  │  │  └─ page.jsx
│  │  ├─ verification/
│  │  │  └─ page.jsx
│  │  ├─ agent-dashboard.css
│  │  └─ layout.jsx
│  ├─ api/
│  │  ├─ admin/
│  │  ├─ auth/
│  │  │  ├─ login/
│  │  │  │  └─ route.js
│  │  │  ├─ me/
│  │  │  │  └─ route.js
│  │  │  ├─ refresh/
│  │  │  │  └─ route.js
│  │  │  └─ signup/
│  │  │     └─ route.js
│  │  ├─ notifications/
│  │  │  └─ stream/
│  │  │     └─ route.ts
│  │  └─ verification/
│  │     ├─ document-types/
│  │     │  └─ route.js
│  │     └─ documents/
│  │        └─ [documentTypeId]/
│  │           └─ route.js
│  ├─ auth/
│  │  ├─ email-sent/
│  │  │  └─ page.jsx
│  │  ├─ login/
│  │  │  └─ page.jsx
│  │  ├─ signup/
│  │  │  └─ page.jsx
│  │  └─ verify-email/
│  │     └─ page.jsx
│  ├─ components/
│  │  ├─ CategoryGrid.jsx
│  │  ├─ DealHotOfMonth.jsx
│  │  ├─ DealsOfTheDay.jsx
│  │  ├─ ExploreCategories.jsx
│  │  ├─ FeaturedBrands.jsx
│  │  ├─ Footer.jsx
│  │  ├─ Header.jsx
│  │  ├─ HeroBanner.jsx
│  │  ├─ MobileAppBanner.jsx
│  │  ├─ ProfessionalVerificationGuard.jsx
│  │  ├─ PromoBanners.jsx
│  │  ├─ RouteGuard.jsx
│  │  ├─ TopSelling.jsx
│  │  └─ WellnessEssentials.jsx
│  ├─ context/
│  │  ├─ AuthContext.jsx
│  │  └─ NotificationContext.jsx
│  ├─ doctor/
│  │  ├─ appointments/
│  │  │  └─ page.jsx
│  │  ├─ dashboard/
│  │  │  ├─ components/
│  │  │  │  ├─ DoctorAnalytics.jsx
│  │  │  │  ├─ DoctorKpiCards.jsx
│  │  │  │  ├─ DoctorNavbar.jsx
│  │  │  │  ├─ DoctorSidebar.jsx
│  │  │  │  ├─ NotificationsPanel.jsx
│  │  │  │  ├─ PatientsOverview.jsx
│  │  │  │  ├─ PrescriptionPanel.jsx
│  │  │  │  ├─ ScheduleWidget.jsx
│  │  │  │  └─ TodayAppointments.jsx
│  │  │  └─ page.jsx
│  │  ├─ messages/
│  │  │  ├─ DoctorMessages.jsx
│  │  │  └─ page.jsx
│  │  ├─ notifications/
│  │  │  ├─ DoctorNotificationsPage.jsx
│  │  │  └─ page.jsx
│  │  ├─ patients/
│  │  │  └─ page.jsx
│  │  ├─ prescription/
│  │  │  ├─ doctor-prescription.css
│  │  │  └─ page.jsx
│  │  ├─ prescriptions/
│  │  │  ├─ doctor-prescriptions.css
│  │  │  └─ page.jsx
│  │  ├─ settings/
│  │  │  └─ page.jsx
│  │  ├─ doctor-appointments.css
│  │  ├─ doctor-dashboard.css
│  │  ├─ doctor-patients.css
│  │  ├─ doctor-settings.css
│  │  └─ layout.jsx
│  ├─ patient/
│  │  ├─ appointments/
│  │  │  ├─ [id]/
│  │  │  │  ├─ AppointmentDetailClient.jsx
│  │  │  │  └─ page.jsx
│  │  │  └─ page.jsx
│  │  ├─ components/
│  │  │  └─ PatientSidebarLayout.jsx
│  │  ├─ dashboard/
│  │  │  ├─ page.jsx
│  │  │  └─ PatientDashboard.jsx
│  │  ├─ doctors/
│  │  │  ├─ [id]/
│  │  │  │  ├─ doctor-profile.css
│  │  │  │  ├─ DoctorProfileClient.jsx
│  │  │  │  └─ page.jsx
│  │  │  └─ page.jsx
│  │  ├─ find-doctor/
│  │  │  ├─ find-doctor.css
│  │  │  ├─ Finddoctorclient.jsx
│  │  │  └─ page.jsx
│  │  ├─ messages/
│  │  │  ├─ page.jsx
│  │  │  └─ PatientMessages.jsx
│  │  ├─ notifications/
│  │  │  ├─ page.jsx
│  │  │  └─ PatientNotificationsPage.jsx
│  │  ├─ pharmacy/
│  │  │  ├─ page.jsx
│  │  │  └─ Patientpharmacypage.jsx
│  │  ├─ prescriptions/
│  │  │  ├─ page.jsx
│  │  │  └─ PatientPrescriptions.jsx
│  │  ├─ vitals/
│  │  │  ├─ page.jsx
│  │  │  └─ PatientHealthVitals.jsx
│  │  ├─ layout.jsx
│  │  ├─ page.jsx
│  │  ├─ patient-dashboard.css
│  │  ├─ patient-prescriptions.css
│  │  ├─ patient-profile.css
│  │  ├─ patient-workflow.css
│  │  ├─ PatientProfileClient.jsx
│  │  └─ PatientProfilePage.jsx
│  ├─ pharmacy/
│  │  ├─ dashboard/
│  │  │  ├─ components/
│  │  │  │  ├─ GraphReport.jsx
│  │  │  │  ├─ PharmacyRequestsTable.jsx
│  │  │  │  ├─ SalesOverview.jsx
│  │  │  │  ├─ Sidebar.jsx
│  │  │  │  ├─ StatsCards.jsx
│  │  │  │  └─ TopNavbar.jsx
│  │  │  └─ page.jsx
│  │  ├─ dashboard.css
│  │  └─ layout.jsx
│  ├─ preview/
│  │  └─ page.jsx
│  ├─ ui/
│  │  └─ page.jsx
│  ├─ clinik.css
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ not-found.jsx
├─ hooks/
│  ├─ use-mobile.ts
│  └─ useVerification.jsx
├─ lib/
│  ├─ api-client.js
│  ├─ auth.service.js
│  ├─ config.js
│  ├─ constants.js
│  ├─ firebase.js
│  └─ utils.ts
├─ .env.local
├─ .gitignore
├─ components.json
├─ eslint.config.mjs
├─ jsconfig.json
├─ next-env.d.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ proxy.js
├─ README.md
└─ tsconfig.json










medsyncpro/
├─ config/
│  ├─ AsyncConfig.java
│  ├─ CorsConfig.java
│  ├─ DataInitializer.java
│  ├─ FirebaseInitializer.java
│  └─ SecurityConfig.java
├─ controller/
│  ├─ AdminController.java
│  ├─ AgentWorkflowController.java
│  ├─ AuthController.java
│  ├─ DoctorAdherenceController.java
│  ├─ DoctorController.java
│  ├─ DoctorSearchController.java
│  ├─ DoctorSettingsController.java
│  ├─ DocumentUploadController.java
│  ├─ FileController.java
│  ├─ MessagingController.java
│  ├─ NotificationController.java
│  ├─ PatientController.java
│  ├─ PatientHealthTrackerController.java
│  ├─ PatientMedicationController.java
│  ├─ PatientPharmacyController.java
│  ├─ PharmacyController.java
│  ├─ PharmacyWorkflowController.java
│  ├─ ProfileController.java
│  └─ PublicQueryController.java
├─ dto/
│  ├─ doctor/
│  │  ├─ AccountSummaryResponse.java
│  │  ├─ AvailabilityRequest.java
│  │  ├─ ChangePasswordRequest.java
│  │  ├─ ClinicRequest.java
│  │  ├─ ClinicResponse.java
│  │  ├─ ConsultationSettingsRequest.java
│  │  ├─ DoctorPublicProfile.java
│  │  ├─ DoctorSearchResult.java
│  │  ├─ NotificationPrefsRequest.java
│  │  ├─ PrivacySettingsRequest.java
│  │  ├─ ProfessionalInfoRequest.java
│  │  └─ ProfessionalInfoResponse.java
│  ├─ request/
│  │  ├─ AppointmentRequest.java
│  │  ├─ AppointmentRescheduleRequest.java
│  │  ├─ CreateMedicationScheduleRequest.java
│  │  ├─ DoctorDocumentUploadRequest.java
│  │  ├─ DocumentTypeRequest.java
│  │  ├─ DoseActionRequest.java
│  │  ├─ FcmTokenRequest.java
│  │  ├─ HealthTrackerEntryRequest.java
│  │  ├─ LoginRequest.java
│  │  ├─ PharmacyAssignAgentRequest.java
│  │  ├─ PharmacyMedicineRequestCreateRequest.java
│  │  ├─ PharmacyRequestStatusUpdateRequest.java
│  │  ├─ RegisterRequest.java
│  │  ├─ ResubmitRequestDTO.java
│  │  ├─ SendMessageRequest.java
│  │  ├─ SignatureRequestDTO.java
│  │  ├─ UpdateMedicationScheduleRequest.java
│  │  ├─ UpdateProfileRequest.java
│  │  ├─ VerificationActionRequest.java
│  │  └─ VerifyEmailRequest.java
│  └─ response/
│     ├─ AdminStatsResponse.java
│     ├─ AdminUserListResponse.java
│     ├─ AdminVerificationDetailResponse.java
│     ├─ AppointmentResponse.java
│     ├─ ChatMessageResponse.java
│     ├─ ConversationResponse.java
│     ├─ DoctorAdherenceAlertResponse.java
│     ├─ DoctorProfileResponseDTO.java
│     ├─ DocumentResponse.java
│     ├─ DocumentTypeConfigResponse.java
│     ├─ DocumentTypeResponse.java
│     ├─ HealthTrackerEntryResponse.java
│     ├─ LoginResponse.java
│     ├─ MedicationAdherenceSummaryResponse.java
│     ├─ MedicationDoseLogResponse.java
│     ├─ MedicationScheduleResponse.java
│     ├─ PagedResponse.java
│     ├─ PharmacyMedicineRequestResponse.java
│     ├─ PharmacySearchResponse.java
│     ├─ PrescriptionResponse.java
│     ├─ ProfileResponse.java
│     ├─ RegisterResponse.java
│     ├─ RequiredDocumentItem.java
│     ├─ SignatureResponseDTO.java
│     ├─ SlotResponse.java
│     └─ VerificationStatusResponse.java
├─ entity/
│  ├─ doctor/
│  │  └─ DoctorSetting.java
│  ├─ Address.java
│  ├─ Admin.java
│  ├─ Agent.java
│  ├─ Appointment.java
│  ├─ AppointmentStatus.java
│  ├─ AuditLog.java
│  ├─ BaseEntity.java
│  ├─ BlacklistedToken.java
│  ├─ ChatMessage.java
│  ├─ ConsultationType.java
│  ├─ Conversation.java
│  ├─ Doctor.java
│  ├─ DoctorClinic.java
│  ├─ DoctorSettings.java
│  ├─ Document.java
│  ├─ DocumentType.java
│  ├─ DoseStatus.java
│  ├─ FileType.java
│  ├─ Gender.java
│  ├─ HealthMetricType.java
│  ├─ HealthTrackerEntry.java
│  ├─ MedicationAdherenceAlert.java
│  ├─ MedicationDoseLog.java
│  ├─ MedicationSchedule.java
│  ├─ Notification.java
│  ├─ Patient.java
│  ├─ Pharmacy.java
│  ├─ PharmacyMedicineRequest.java
│  ├─ PharmacyRequestStatus.java
│  ├─ Prescription.java
│  ├─ RefreshToken.java
│  ├─ ReminderScheduleType.java
│  ├─ Role.java
│  ├─ Speciality.java
│  ├─ Status.java
│  ├─ User.java
│  ├─ UserModelType.java
│  ├─ VerificationRequest.java
│  ├─ VerificationStatus.java
│  └─ VerificationToken.java
├─ event/
│  ├─ AppointmentBookedEvent.java
│  ├─ AppointmentCancelledEvent.java
│  ├─ AppointmentEventListener.java
│  ├─ DocumentSubmittedEvent.java
│  ├─ UserSignupEvent.java
│  ├─ VerificationDecisionEvent.java
│  ├─ VerificationEventHandler.java
│  ├─ VerificationEventListener.java
│  ├─ VerificationResubmitEvent.java
│  └─ VerificationSubmittedEvent.java
├─ exception/
│  ├─ BusinessException.java
│  ├─ GlobalExceptionHandler.java
│  └─ ResourceNotFoundException.java
├─ filter/
│  └─ JwtAuthenticationFilter.java
├─ mapper/
│  └─ ProfileMapper.java
├─ repository/
│  ├─ AdminRepository.java
│  ├─ AgentRepository.java
│  ├─ AppointmentRepository.java
│  ├─ AuditLogRepository.java
│  ├─ BlacklistedTokenRepository.java
│  ├─ ChatMessageRepository.java
│  ├─ ConversationRepository.java
│  ├─ DoctorClinicRepository.java
│  ├─ DoctorRepository.java
│  ├─ DoctorSettingsRepository.java
│  ├─ DocumentRepository.java
│  ├─ DocumentTypeRepository.java
│  ├─ HealthTrackerEntryRepository.java
│  ├─ MedicationAdherenceAlertRepository.java
│  ├─ MedicationDoseLogRepository.java
│  ├─ MedicationScheduleRepository.java
│  ├─ NotificationRepository.java
│  ├─ PatientRepository.java
│  ├─ PharmacyMedicineRequestRepository.java
│  ├─ PharmacyRepository.java
│  ├─ PrescriptionRepository.java
│  ├─ RefreshTokenRepository.java
│  ├─ UserRepository.java
│  ├─ VerificationRequestRepository.java
│  └─ VerificationTokenRepository.java
├─ response/
│  └─ ApiResponse.java
├─ service/
│  ├─ impl/
│  │  └─ CloudinaryStorageService.java
│  ├─ AdminInitializationService.java
│  ├─ AdminService.java
│  ├─ AuditLogService.java
│  ├─ AuthService.java
│  ├─ DoctorSearchService.java
│  ├─ DoctorService.java
│  ├─ DoctorSettingsService.java
│  ├─ EmailService.java
│  ├─ FileStorageService.java
│  ├─ FirebasePushService.java
│  ├─ HealthTrackerService.java
│  ├─ JwtService.java
│  ├─ MedicationReminderScheduler.java
│  ├─ MedicationWorkflowService.java
│  ├─ MessagingService.java
│  ├─ NotificationDispatchService.java
│  ├─ OnlyQueryService.java
│  ├─ PatientService.java
│  ├─ PharmacyService.java
│  ├─ PharmacyWorkflowService.java
│  ├─ ProfileService.java
│  ├─ RefreshTokenService.java
│  ├─ SseEmitterService.java
│  ├─ TokenBlacklistService.java
│  ├─ UserService.java
│  └─ VerificationService.java
├─ utils/
│  ├─ UserProfileHelper.java
│  └─ Utils.java
└─ MedsyncproApplication.java