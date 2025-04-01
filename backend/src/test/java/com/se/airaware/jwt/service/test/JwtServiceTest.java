package com.se.airaware.jwt.service.test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.lang.reflect.Field;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.se.airaware.jwt.CustomUserDetailsService;
import com.se.airaware.jwt.JwtService;
import com.se.airaware.user.User;
import com.se.airaware.user.repository.UserRepository;


@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @InjectMocks
    private JwtService jwtService;

    private final String secretKey = "dYF7m4HdMT1JQzgW2F7k3fFL7ZkOZ6nXU1k7Mw1tDM8=";

    @BeforeEach
    void setUp() throws Exception {
        jwtService = new JwtService();
        Field secretKeyField = JwtService.class.getDeclaredField("secretKey");
        secretKeyField.setAccessible(true);
        secretKeyField.set(jwtService, secretKey);
    }

    @Test
    void testGenerateToken() {
        String token = jwtService.generateToken("testUser");
        assertNotNull(token);
    }

    @Test
    void testExtractUserName() {
        String token = jwtService.generateToken("testUser");
        String extractedUsername = jwtService.extractUserName(token);
        assertEquals("testUser", extractedUsername);
    }

    @Test
    void testValidateToken() {
        String token = jwtService.generateToken("testUser");
        UserDetails mockUserDetails = mock(UserDetails.class);
        when(mockUserDetails.getUsername()).thenReturn("testUser");
        
        assertTrue(jwtService.validate(token, mockUserDetails));
    }
    
    @Test
    void testIsTokenExpired() {
        String token = jwtService.generateToken("testUser");
        assertFalse(jwtService.validate(token, mock(UserDetails.class)));
    }
}

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    @Test
    void testLoadUserByUsername_UserFound() {
        User mockUser = mock(User.class);
        when(userRepository.findByEmail("testUser"))
                .thenReturn(mockUser);

        UserDetails userDetails = userDetailsService.loadUserByUsername("testUser");
        assertNotNull(userDetails);
    }

    @Test
    void testLoadUserByUsername_NotFound() {
        when(userRepository.findByEmail("unknownUser")).thenReturn(null);

        assertThrows(UsernameNotFoundException.class, () -> 
                userDetailsService.loadUserByUsername("unknownUser"));
    }
}
