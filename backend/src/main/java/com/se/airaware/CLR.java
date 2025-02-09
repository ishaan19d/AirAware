package com.se.airaware;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.se.airaware.admin.Admin;
import com.se.airaware.admin.repository.AdminRepository;
import com.se.airaware.user.User;
import com.se.airaware.user.repository.UserRepository;

//@Component
public class CLR implements CommandLineRunner {
	
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    public CLR(AdminRepository adminRepository, UserRepository userRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
    }
    
	@Override
	public void run(String... args) throws Exception {
		System.out.println("LoL");
		
        Admin admin = new Admin();
        admin.setUsername("admin123");
        admin.setPassword("securepassword");
        
        User user = new User();
        user.setName("Ishaan");
        user.setEmail("huehue@gmail.com");
        user.setPassword("securePass");
        user.setPhoneNumber("8084411910");
        user.setPremiumUser(false);
        
        List<String> alPref = new ArrayList<>();
        alPref.add("Email");
        alPref.add("Phone Number");
        user.setAlertPreferences(alPref);
        
        List<String> triggers = new ArrayList<>();
        triggers.add("Pollen");
        triggers.add("SO2");
        user.setTriggers(triggers);
        
        userRepository.save(user);
        adminRepository.save(admin);
       

        System.out.println("Inserted Admin into MongoDB: " + admin);
        
        System.out.println("Aa gaayyyyyaaa: "+adminRepository.findByUsername("ishaantest"));
	}
}