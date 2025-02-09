package com.se.airaware.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.se.airaware.admin.Admin;
import com.se.airaware.admin.AdminAuthenticationDetails;
import com.se.airaware.admin.repository.AdminRepository;
import com.se.airaware.user.User;
import com.se.airaware.user.UserAuthenticationDetails;
import com.se.airaware.user.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService{

	@Autowired
	private AdminRepository adminRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	    User user = userRepository.findByEmail(username);
	    Admin admin = adminRepository.findByUsername(username);

	    if (user != null) {
	        return new UserAuthenticationDetails(user);
	    } else if (admin != null) {
	        return new AdminAuthenticationDetails(admin);
	    }

	    throw new UsernameNotFoundException("User not found");
	}
}