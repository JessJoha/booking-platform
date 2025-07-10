package com.bookingplatform.auditlogs.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

@Schema(description = "Data Transfer Object for creating a new Audit Log entry")
public class CreateAuditLogDto {

    @Schema(description = "ID of the user performing the action", example = "user123", required = true)
    @NotBlank(message = "User ID is required")
    private String userId;

    @Schema(description = "Username of the user performing the action", example = "john.doe")
    private String username;

    @Schema(description = "Type of action being performed", example = "CREATE_RESERVATION", required = true)
    @NotBlank(message = "Action is required")
    private String action;

    @Schema(description = "Type of resource being affected", example = "RESERVATION", required = true)
    @NotBlank(message = "Resource type is required")
    private String resourceType;

    @Schema(description = "ID of the resource being affected", example = "res123")
    private String resourceId;

    @Schema(description = "IP address from which the action is performed", example = "192.168.1.100")
    private String ipAddress;

    @Schema(description = "User agent of the client", example = "Mozilla/5.0...")
    private String userAgent;

    @Schema(description = "Expected result of the action", example = "SUCCESS")
    private String result;

    @Schema(description = "Additional details about the action")
    private Map<String, Object> details;

    @Schema(description = "Error message if action failed")
    private String errorMessage;

    @Schema(description = "Session ID", example = "sess123")
    private String sessionId;

    // Default constructor
    public CreateAuditLogDto() {}

    // Constructor with required fields
    public CreateAuditLogDto(String userId, String action, String resourceType) {
        this.userId = userId;
        this.action = action;
        this.resourceType = resourceType;
    }

    // Constructor with all fields
    public CreateAuditLogDto(String userId, String username, String action, String resourceType,
                            String resourceId, String ipAddress, String userAgent, String result,
                            Map<String, Object> details, String errorMessage, String sessionId) {
        this.userId = userId;
        this.username = username;
        this.action = action;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.result = result;
        this.details = details;
        this.errorMessage = errorMessage;
        this.sessionId = sessionId;
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
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

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
