package com.se.airaware.admin.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.se.airaware.admin.Admin;
import java.util.Optional;

public interface AdminRepository extends MongoRepository<Admin, String> {
    Admin findByUsername(String username);
    boolean existsByUsername(String username);
}
