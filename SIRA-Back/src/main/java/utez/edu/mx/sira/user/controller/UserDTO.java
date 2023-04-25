package utez.edu.mx.sira.user.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import utez.edu.mx.sira.role.model.Role;
import utez.edu.mx.sira.user.model.User;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserDTO {
    private long id;

    @Pattern(regexp = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$", message = "El correo no es válido")
    private String email;

    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    private String fullname;

    private Boolean status;

    private Role role;

    public User castToUser() {
        return new User(
                getId(),
                getEmail(),
                getPassword(),
                getFullname(),
                getStatus(),
                getRole(),
                null,
                null
        );
    }
}
