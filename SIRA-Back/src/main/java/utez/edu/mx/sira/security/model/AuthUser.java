package utez.edu.mx.sira.security.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import utez.edu.mx.sira.role.model.Role;
import utez.edu.mx.sira.user.model.User;
import java.util.Collection;

public class AuthUser implements UserDetails {
    private String email;
    private String password;
    private boolean status;
    private Role role;

    public AuthUser(String email, String password, boolean status, Role role) {
        this.email = email;
        this.password = password;
        this.status = status;
        this.role = role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public static AuthUser build(User user) {
        return new AuthUser(user.getEmail(), user.getPassword(), user.getStatus(), user.getRole());
    }
}
