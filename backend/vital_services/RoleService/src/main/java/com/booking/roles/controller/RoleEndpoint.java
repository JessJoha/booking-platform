package com.booking.roles.controller;

import com.booking.roles.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ws.server.endpoint.annotation.*;

import javax.xml.bind.annotation.XmlRootElement;

@Endpoint
public class RoleEndpoint {

    private static final String NAMESPACE_URI = "http://booking.com/roles";

    @Autowired
    private RoleService roleService;

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "assignRoleRequest")
    @ResponsePayload
    public AssignRoleResponse assignRole(@RequestPayload AssignRoleRequest request) {
        String message = roleService.assignRole(request.getUsername(), request.getRole());

        AssignRoleResponse response = new AssignRoleResponse();
        response.setMessage(message);
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getRoleRequest")
    @ResponsePayload
    public GetRoleResponse getRole(@RequestPayload GetRoleRequest request) {
        String role = roleService.getRoleByUsername(request.getUsername());

        GetRoleResponse response = new GetRoleResponse();
        response.setRole(role);
        return response;
    }

    @XmlRootElement(namespace = NAMESPACE_URI)
    public static class AssignRoleRequest {
        private String username;
        private String role;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    @XmlRootElement(namespace = NAMESPACE_URI)
    public static class AssignRoleResponse {
        private String message;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    @XmlRootElement(namespace = NAMESPACE_URI)
    public static class GetRoleRequest {
        private String username;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
    }

    @XmlRootElement(namespace = NAMESPACE_URI)
    public static class GetRoleResponse {
        private String role;

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
