package com.se.airaware.admin.service;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.se.airaware.admin.Admin;
import com.se.airaware.admin.repository.AdminRepository;
import com.se.airaware.jwt.JwtService;

import jakarta.validation.Valid;

@Service
public class AdminService {
	
	private AdminRepository adminRepository;
	private BCryptPasswordEncoder encoder;
	private AuthenticationManager authManager;
	private JwtService jwtService;
	
	public AdminService(AdminRepository adminRepository, BCryptPasswordEncoder encoder,
			AuthenticationManager authManager, JwtService jwtService) {
		super();
		this.adminRepository = adminRepository;
		this.encoder = encoder;
		this.authManager = authManager;
		this.jwtService = jwtService;
	}
	
    public Admin register(@Valid Admin admin) {
        if (adminRepository.existsByUsername(admin.getUsername())) {
            throw new DuplicateKeyException("Username already exists: " + admin.getUsername());
        }
        admin.setPassword(encoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }
	
	public String verify(@Valid Admin admin) throws Exception {
		try {
			Authentication authentication = authManager.authenticate(
					new UsernamePasswordAuthenticationToken(admin.getUsername(), admin.getPassword()));
			if (authentication.isAuthenticated()) {
				return jwtService.generateToken(admin.getUsername());
			}			
		}
		catch (AuthenticationException e){
			System.out.println("Exception in login" + e);
			throw new Exception("Invalid email or password");
		}
		return null;
	}

	
}
