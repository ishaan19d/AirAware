package com.se.airaware.jwt;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.se.airaware.user.User;
import com.se.airaware.user.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;


@Service
public class JwtService {
	@Value("${jwt.secretKey}")
    private String secretKey;
	
	@Autowired
	private UserRepository userRepository;
    
	public String generateToken(String username) {
		Map<String, Object> claims = new HashMap<>();
		
		User user = userRepository.findByEmail(username);
		claims.put("name", user.getName());
		claims.put("phoneNumber", user.getPhoneNumber());
		claims.put("isPremiumUser", user.isPremiumUser());
		claims.put("location", user.getLocation());
		claims.put("diseases", user.getDiseases());
		return Jwts.builder()
				.claims()
				.add(claims)
				.subject(username)
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + 30 * 60 * 1000))
				.and()
				.signWith(getKey())
				.compact();
	}
	
	private Key getKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
		return Keys.hmacShaKeyFor(keyBytes);
	}
	
	public String extractUserName(String token) {
		return extractClaim(token, Claims::getSubject);
	}
	
	private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }
	
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    
	public boolean validate(String token, UserDetails userDetails) {
		final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}
	
	private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
	
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
