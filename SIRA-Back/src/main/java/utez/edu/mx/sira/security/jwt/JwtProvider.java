package utez.edu.mx.sira.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import utez.edu.mx.sira.security.model.AuthUser;

import java.util.Date;

@Component
public class JwtProvider {
    public final static Logger LOGGER = LoggerFactory.getLogger(JwtProvider.class);
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private int expiration;


    public String generateToken(Authentication authentication) {
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        return Jwts.builder().setSubject(authUser.getUsername())
                .setIssuedAt(new Date()) //.setExpiration(new Date(new Date().getTime() + expiration * 1000L))
                .signWith(SignatureAlgorithm.HS512, secret).compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            LOGGER.error("Error en el token");
        }
        return false;
    }
}
