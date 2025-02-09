package com.se.airaware.user.repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.se.airaware.user.User;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
}