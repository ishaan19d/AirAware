package com.se.airaware.user.repository.test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.se.airaware.user.User;
import com.se.airaware.user.repository.UserRepository;

@ExtendWith(SpringExtension.class)
@DataMongoTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveAndFindByEmail() {
        User user = new User();
        user.setId("1");
        user.setEmail("test@example.com");
        user.setPhoneNumber("1234567890");
        user.setPassword("password");

        userRepository.save(user);
        
        User foundUser = userRepository.findByEmail("test@example.com");
        assertNotNull(foundUser);
        assertEquals("test@example.com", foundUser.getEmail());
    }

    @Test
    void testExistsByEmail() {
        User user = new User();
        user.setId("2");
        user.setEmail("exists@example.com");
        user.setPhoneNumber("9876543210");
        user.setPassword("securepass");

        userRepository.save(user);

        assertTrue(userRepository.existsByEmail("exists@example.com"));
        assertFalse(userRepository.existsByEmail("notfound@example.com"));
    }

    @Test
    void testExistsByPhoneNumber() {
        User user = new User();
        user.setId("3");
        user.setEmail("phone@example.com");
        user.setPhoneNumber("5555555555");
        user.setPassword("pass123");

        userRepository.save(user);

        assertTrue(userRepository.existsByPhoneNumber("5555555555"));
        assertFalse(userRepository.existsByPhoneNumber("1111111111"));
    }
}
