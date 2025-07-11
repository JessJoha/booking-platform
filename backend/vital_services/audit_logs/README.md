# 📋 Audit Logs Service

## Overview
Enterprise-grade audit logging service for the Booking Platform, providing comprehensive event tracking, compliance reporting, and security monitoring capabilities.

## Features
- **Comprehensive Audit Trail**: Track all user actions and system events
- **Compliance Support**: GDPR, PCI-DSS, SOX compliance features
- **Real-time Monitoring**: Real-time event processing and alerting
- **Advanced Search**: Elasticsearch-powered search and filtering
- **Data Retention**: Configurable retention policies and archiving
- **Security Monitoring**: Anomaly detection and threat identification
- **API Integration**: RESTful API for log retrieval and analysis
- **Performance Optimized**: High-throughput logging with minimal latency

## Tech Stack
- **Java 17** with Spring Boot 3.2
- **PostgreSQL** for primary data storage
- **Elasticsearch** for search and analytics
- **Redis** for caching and performance
- **Liquibase** for database migrations
- **Spring Security** for authentication
- **OpenAPI 3** for documentation

## API Endpoints

### Audit Logs
- `POST /api/v1/audit-logs` - Create audit log entry
- `GET /api/v1/audit-logs` - Search and filter audit logs
- `GET /api/v1/audit-logs/{id}` - Get specific audit log
- `GET /api/v1/audit-logs/export` - Export audit logs

### Analytics
- `GET /api/v1/analytics/summary` - Audit summary statistics
- `GET /api/v1/analytics/trends` - Event trends and patterns
- `GET /api/v1/analytics/security` - Security-related events

### Compliance
- `GET /api/v1/compliance/gdpr` - GDPR compliance reports
- `GET /api/v1/compliance/export` - Export compliance data
- `POST /api/v1/compliance/data-request` - Handle data requests

### Health & Monitoring
- `GET /actuator/health` - Service health check
- `GET /actuator/metrics` - Service metrics
- `GET /actuator/info` - Service information

## Event Types

### User Events
- `USER_LOGIN` - User authentication
- `USER_LOGOUT` - User session termination
- `USER_REGISTRATION` - New user registration
- `USER_PROFILE_UPDATE` - Profile modifications
- `PASSWORD_CHANGE` - Password updates
- `PERMISSION_CHANGE` - Permission modifications

### Booking Events
- `BOOKING_CREATED` - New booking creation
- `BOOKING_UPDATED` - Booking modifications
- `BOOKING_CANCELLED` - Booking cancellations
- `BOOKING_CONFIRMED` - Booking confirmations
- `PAYMENT_PROCESSED` - Payment transactions

### System Events
- `SYSTEM_STARTUP` - Service startup
- `SYSTEM_SHUTDOWN` - Service shutdown
- `CONFIG_CHANGE` - Configuration changes
- `ERROR_OCCURRED` - System errors
- `SECURITY_VIOLATION` - Security breaches

## Configuration

### Application Properties
```yaml
# Database Configuration
spring.datasource.url: jdbc:postgresql://localhost:5432/audit_logs
spring.datasource.username: ${DB_USER:postgres}
spring.datasource.password: ${DB_PASSWORD:password}

# Elasticsearch Configuration
spring.elasticsearch.uris: http://localhost:9200

# Redis Configuration
spring.redis.host: localhost
spring.redis.port: 6379

# Audit Configuration
audit.retention-days: 2555  # 7 years for compliance
audit.batch-size: 1000
audit.async-enabled: true
audit.elasticsearch-enabled: true

# Security Configuration
security.jwt.secret: ${JWT_SECRET:your-secret-key}
security.jwt.expiration: 86400000

# Compliance Configuration
compliance.gdpr.enabled: true
compliance.encryption.enabled: true
compliance.anonymization.enabled: true
```

## Usage Examples

### Creating Audit Logs
```bash
curl -X POST http://localhost:8080/api/v1/audit-logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -d '{
    "userId": "user123",
    "eventType": "USER_LOGIN",
    "resourceType": "USER",
    "serviceName": "user-management",
    "action": "LOGIN",
    "status": "SUCCESS",
    "description": "User logged in successfully",
    "ipAddress": "192.168.1.100"
  }'
```

### Searching Audit Logs
```bash
curl -X GET "http://localhost:8080/api/v1/audit-logs?userId=user123&eventType=USER_LOGIN&fromDate=2024-01-01&toDate=2024-01-31" \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

### Getting Analytics
```bash
curl -X GET "http://localhost:8080/api/v1/analytics/summary?fromDate=2024-01-01&toDate=2024-01-31" \
  -H "Authorization: Bearer ${JWT_TOKEN}"
```

## Development Setup

1. **Prerequisites**:
   - Java 17+
   - Maven 3.8+
   - PostgreSQL 15+
   - Elasticsearch 8.x (optional)
   - Redis 6.x (optional)

2. **Clone and setup**:
   ```bash
   cd backend/audit_logs
   cp src/main/resources/application-dev.yml.example src/main/resources/application-dev.yml
   # Edit configuration as needed
   ```

3. **Database setup**:
   ```bash
   # Create database
   createdb audit_logs
   
   # Run migrations
   mvn liquibase:update
   ```

4. **Build and run**:
   ```bash
   mvn clean install
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

5. **Access documentation**:
   ```
   http://localhost:8080/swagger-ui.html
   ```

## Docker Deployment

### Local Development
```bash
# Build image
docker build -t audit-logs .

# Run with Docker Compose
docker-compose up -d
```

### Production Deployment
```bash
# Create network
docker network create booking-platform

# Run PostgreSQL
docker run -d --name audit-postgres \
  --network booking-platform \
  -e POSTGRES_DB=audit_logs \
  -e POSTGRES_USER=audit_user \
  -e POSTGRES_PASSWORD=secure_password \
  postgres:15

# Run application
docker run -d --name audit-logs \
  --network booking-platform \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_HOST=audit-postgres \
  audit-logs
```

## Performance Considerations

### High-Throughput Logging
- **Async Processing**: Non-blocking audit log creation
- **Batch Processing**: Bulk insertions for better performance
- **Connection Pooling**: Optimized database connections
- **Caching**: Redis caching for frequently accessed data

### Scalability
- **Horizontal Scaling**: Stateless service design
- **Database Partitioning**: Time-based table partitioning
- **Load Balancing**: Support for multiple instances
- **Message Queues**: Queue-based processing for high volume

## Security Features

### Data Protection
- **Encryption at Rest**: Sensitive data encryption
- **PII Anonymization**: Automatic PII masking
- **Access Control**: Role-based access to audit logs
- **Secure Transport**: HTTPS/TLS encryption

### Monitoring & Alerting
- **Anomaly Detection**: Unusual pattern detection
- **Real-time Alerts**: Security event notifications
- **Threshold Monitoring**: Volume and pattern monitoring
- **Integration**: SIEM system integration

## Compliance Features

### GDPR Compliance
- **Right to Access**: Data export capabilities
- **Right to Erasure**: Data anonymization
- **Data Portability**: Standard export formats
- **Consent Tracking**: Consent change logging

### Audit Requirements
- **Immutable Logs**: Tamper-evident logging
- **Digital Signatures**: Log integrity verification
- **Retention Policies**: Automated data lifecycle
- **Compliance Reporting**: Standard compliance reports

## Integration Points

### Service Integration
- **User Management**: Authentication and authorization events
- **Booking Management**: Booking lifecycle events
- **Payment Gateway**: Financial transaction events
- **Review Management**: Content moderation events

### External Integration
- **SIEM Systems**: Security event forwarding
- **Log Aggregators**: ELK Stack integration
- **Monitoring Tools**: Prometheus metrics
- **Alerting Systems**: Real-time notifications

## Monitoring & Observability

### Metrics
- Log ingestion rate
- Storage utilization
- Query performance
- Error rates
- Compliance metrics

### Health Checks
- Database connectivity
- Elasticsearch status
- Redis availability
- Service dependencies
