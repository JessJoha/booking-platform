package com.bookingplatform.auditlogs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookingplatform.auditlogs.dto.AuditLogDto;
import com.bookingplatform.auditlogs.dto.CreateAuditLogDto;
import com.bookingplatform.auditlogs.service.AuditLogService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/audit-logs")
@Tag(name = "Audit Logs", description = "Comprehensive audit logging operations for tracking system activities")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @Operation(
        summary = "Create a new audit log entry",
        description = "Creates a new audit log entry to track system activities and user actions"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Audit log entry created successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = AuditLogDto.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid input data",
            content = @Content(mediaType = "application/json")
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(mediaType = "application/json")
        )
    })
    @PostMapping
    public ResponseEntity<AuditLogDto> createAuditLog(
        @Parameter(description = "Audit log data to be created", required = true)
        @Valid @RequestBody CreateAuditLogDto createAuditLogDto
    ) {
        AuditLogDto createdLog = auditLogService.createAuditLog(createAuditLogDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLog);
    }

    @Operation(
        summary = "Get audit log by ID",
        description = "Retrieves a specific audit log entry by its unique identifier"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Audit log found",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = AuditLogDto.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Audit log not found",
            content = @Content(mediaType = "application/json")
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(mediaType = "application/json")
        )
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<AuditLogDto>> getAuditLogsByUserId(
        @Parameter(description = "User ID to filter audit logs", required = true)
        @PathVariable String userId,
        
        @Parameter(description = "Page number (0-based)", example = "0")
        @RequestParam(defaultValue = "0") int page,
        
        @Parameter(description = "Number of items per page", example = "20")
        @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<AuditLogDto> auditLogs = auditLogService.getAuditLogsByUserId(userId, pageable);
        return ResponseEntity.ok(auditLogs);
    }

    @Operation(
        summary = "Get audit logs by action type",
        description = "Retrieves all audit log entries for a specific action type with pagination"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Action audit logs retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Page.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(mediaType = "application/json")
        )
    })

    @GetMapping("/statistics")
    public ResponseEntity<?> getAuditStatistics() {
        return ResponseEntity.ok(auditLogService.getAuditStatistics());
    }

    @Operation(
        summary = "Health check endpoint",
        description = "Returns the health status of the audit logs service"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Service is healthy",
            content = @Content(mediaType = "application/json")
        )
    })
    @GetMapping("/")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(new HealthResponse("Audit Logs Service is running", "UP"));
    }

    private static class HealthResponse {
        private String status;
        private String message;

        public HealthResponse(String message, String status) {
            this.message = message;
            this.status = status;
        }

        public String getStatus() { return status; }
        public String getMessage() { return message; }
    }
}
