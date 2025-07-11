package com.bookingplatform.auditlogs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main application class for the Audit Logs Service
 * 
 * This service provides comprehensive audit logging capabilities for the booking platform,
 * including event tracking, compliance reporting, and security monitoring.
 * 
 * @author Booking Platform Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
@EnableAsync
@EnableScheduling
public class AuditLogsApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuditLogsApplication.class, args);
    }
}
