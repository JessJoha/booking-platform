package com.bookingplatform.auditlogs.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI auditLogsOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:" + serverPort);
        devServer.setDescription("Development server");

        Server prodServer = new Server();
        prodServer.setUrl("https://api.bookingplatform.com/audit-logs");
        prodServer.setDescription("Production server");

        Contact contact = new Contact();
        contact.setEmail("admin@bookingplatform.com");
        contact.setName("Booking Platform Team");
        contact.setUrl("https://www.bookingplatform.com");

        License mitLicense = new License()
                .name("MIT License")
                .url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
                .title("Audit Logs Service API")
                .version("1.0.0")
                .contact(contact)
                .description("Comprehensive audit logging service for tracking system activities and user actions in the booking platform. " +
                           "This service provides endpoints for creating, retrieving, and managing audit log entries with advanced filtering and pagination capabilities.")
                .termsOfService("https://www.bookingplatform.com/terms")
                .license(mitLicense);

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer, prodServer));
    }
}
