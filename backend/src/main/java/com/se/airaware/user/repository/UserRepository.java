package com.se.airaware.user.repository;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.se.airaware.user.User;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    
    List<User> findByIsPremiumUserTrueAndLocation_CityIgnoreCaseAndLocation_StateIgnoreCase(String city, String state);

}