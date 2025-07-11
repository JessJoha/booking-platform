package com.bookingplatform.auditlogs.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Entity representing an audit log entry
 * 
 * This entity captures all significant events and changes within the booking platform
 * for compliance, security, and debugging purposes.
 */
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_user_id", columnList = "user_id"),
    @Index(name = "idx_audit_event_type", columnList = "event_type"),
    @Index(name = "idx_audit_resource_type", columnList = "resource_type"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp"),
    @Index(name = "idx_audit_ip_address", columnList = "ip_address"),
    @Index(name = "idx_audit_service", columnList = "service_name")
})
@EntityListeners(AuditingEntityListener.class)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @CreatedDate
    @Column(name = "timestamp", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private LocalDateTime timestamp;

    @NotBlank
    @Size(max = 100)
    @Column(name = "user_id", length = 100)
    private String userId;

    @Size(max = 100)
    @Column(name = "session_id", length = 100)
    private String sessionId;

    @NotBlank
    @Size(max = 50)
    @Column(name = "event_type", length = 50, nullable = false)
    private String eventType;

    @NotBlank
    @Size(max = 50)
    @Column(name = "resource_type", length = 50, nullable = false)
    private String resourceType;

    @Size(max = 100)
    @Column(name = "resource_id", length = 100)
    private String resourceId;

    @NotBlank
    @Size(max = 50)
    @Column(name = "service_name", length = 50, nullable = false)
    private String serviceName;

    @NotBlank
    @Size(max = 10)
    @Column(name = "action", length = 10, nullable = false)
    private String action; // CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, etc.

    @NotBlank
    @Size(max = 20)
    @Column(name = "status", length = 20, nullable = false)
    private String status; // SUCCESS, FAILURE, ERROR

    @Size(max = 200)
    @Column(name = "description", length = 200)
    private String description;

    @Size(max = 45)
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Size(max = 500)
    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Size(max = 100)
    @Column(name = "request_id", length = 100)
    private String requestId;

    @Size(max = 50)
    @Column(name = "correlation_id", length = 50)
    private String correlationId;

    @Column(name = "duration_ms")
    private Long durationMs;

    @Size(max = 20)
    @Column(name = "severity", length = 20)
    private String severity; // INFO, WARN, ERROR, CRITICAL

    @Column(name = "old_values", columnDefinition = "jsonb")
    private String oldValues;

    @Column(name = "new_values", columnDefinition = "jsonb")
    private String newValues;

    @Column(name = "metadata", columnDefinition = "jsonb")
    private String metadata;

    @Size(max = 1000)
    @Column(name = "error_message", length = 1000)
    private String errorMessage;

    @Size(max = 5000)
    @Column(name = "stack_trace", length = 5000)
    private String stackTrace;

    @Size(max = 100)
    @Column(name = "location", length = 100)
    private String location; // Geographic location if available

    @Size(max = 100)
    @Column(name = "device_type", length = 100)
    private String deviceType;

    @Column(name = "is_sensitive")
    private Boolean isSensitive = false;

    @Column(name = "is_compliance_relevant")
    private Boolean isComplianceRelevant = false;

    @Size(max = 50)
    @Column(name = "compliance_category", length = 50)
    private String complianceCategory; // GDPR, PCI_DSS, SOX, etc.

    // Constructors
    public AuditLog() {}

    public AuditLog(String userId, String eventType, String resourceType, String serviceName, String action, String status) {
        this.userId = userId;
        this.eventType = eventType;
        this.resourceType = resourceType;
        this.serviceName = serviceName;
        this.action = action;
        this.status = status;
        this.severity = "INFO";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public void setCorrelationId(String correlationId) {
        this.correlationId = correlationId;
    }

    public Long getDurationMs() {
        return durationMs;
    }

    public void setDurationMs(Long durationMs) {
        this.durationMs = durationMs;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getOldValues() {
        return oldValues;
    }

    public void setOldValues(String oldValues) {
        this.oldValues = oldValues;
    }

    public String getNewValues() {
        return newValues;
    }

    public void setNewValues(String newValues) {
        this.newValues = newValues;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getStackTrace() {
        return stackTrace;
    }

    public void setStackTrace(String stackTrace) {
        this.stackTrace = stackTrace;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public Boolean getIsSensitive() {
        return isSensitive;
    }

    public void setIsSensitive(Boolean isSensitive) {
        this.isSensitive = isSensitive;
    }

    public Boolean getIsComplianceRelevant() {
        return isComplianceRelevant;
    }

    public void setIsComplianceRelevant(Boolean isComplianceRelevant) {
        this.isComplianceRelevant = isComplianceRelevant;
    }

    public String getComplianceCategory() {
        return complianceCategory;
    }

    public void setComplianceCategory(String complianceCategory) {
        this.complianceCategory = complianceCategory;
    }

    @Override
    public String toString() {
        return "AuditLog{" +
                "id=" + id +
                ", timestamp=" + timestamp +
                ", userId='" + userId + '\'' +
                ", eventType='" + eventType + '\'' +
                ", resourceType='" + resourceType + '\'' +
                ", serviceName='" + serviceName + '\'' +
                ", action='" + action + '\'' +
                ", status='" + status + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
