package com.booking.roles.service;

import com.booking.roles.model.Role;
import com.booking.roles.model.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public String assignRole(String username, String roleName) {
        Role existing = roleRepository.findByUsername(username);
        if (existing != null) {
            existing.setRole(roleName);
            roleRepository.save(existing);
            return "Role updated for " + username;
        } else {
            Role newRole = new Role(username, roleName);
            roleRepository.save(newRole);
            return "Role assigned to " + username;
        }
    }

    public String getRoleByUsername(String username) {
        Role role = roleRepository.findByUsername(username);
        return (role != null) ? role.getRole() : "user"; // default
    }
}
