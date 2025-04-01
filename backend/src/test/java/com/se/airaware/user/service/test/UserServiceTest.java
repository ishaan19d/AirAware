package com.se.airaware.user.service.test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.se.airaware.dto.AuthRequest;
import com.se.airaware.jwt.JwtService;
import com.se.airaware.user.User;
import com.se.airaware.user.repository.UserRepository;
import com.se.airaware.user.service.UserService;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder encoder;

    @Mock
    private AuthenticationManager authManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser_Success() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPhoneNumber("1234567890");
        user.setPassword("password");

        when(userRepository.existsByEmail(user.getEmail())).thenReturn(false);
        when(userRepository.existsByPhoneNumber(user.getPhoneNumber())).thenReturn(false);
        when(encoder.encode(user.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User registeredUser = userService.register(user);

        assertNotNull(registeredUser);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testRegisterUser_DuplicateEmail() {
        User user = new User();
        user.setEmail("duplicate@example.com");
        user.setPhoneNumber("1234567890");

        when(userRepository.existsByEmail(user.getEmail())).thenReturn(true);

        assertThrows(DuplicateKeyException.class, () -> userService.register(user));
    }

    @Test
    void testVerify_Success() throws Exception {
        AuthRequest authRequest = new AuthRequest("user@example.com", "password");
        Authentication authentication = mock(Authentication.class);

        when(authManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(jwtService.generateToken(authRequest.getUsername())).thenReturn("jwt_token");

        String token = userService.verify(authRequest);

        assertNotNull(token);
        assertEquals("jwt_token", token);
    }

    @Test
    void testVerify_InvalidCredentials() {
        AuthRequest authRequest = new AuthRequest("ishaan.das22b@iiitg.ac.in", "SecurePass123");

        when(authManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid email or password"));

        assertThrows(BadCredentialsException.class, () -> userService.verify(authRequest));
    }

    @Test
    void testMarkUserAsPremium_Success() {
        User user = new User();
        user.setEmail("premium@example.com");

        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);
        when(userRepository.save(any(User.class))).thenReturn(user);

        assertDoesNotThrow(() -> userService.markUserAsPremium(user.getEmail()));
        assertTrue(user.isPremiumUser());
    }

    @Test
    void testMarkUserAsPremium_UserNotFound() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(null);

        assertThrows(RuntimeException.class, () -> userService.markUserAsPremium("notfound@example.com"));
    }
}
