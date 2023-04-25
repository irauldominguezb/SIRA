package utez.edu.mx.sira.user.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import utez.edu.mx.sira.aspect.model.Aspect;
import utez.edu.mx.sira.report.model.Report;
import utez.edu.mx.sira.role.model.Role;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true)
    @NotNull
    private String email;

    @NotNull
    private String password;

    @NotNull
    private String fullname;

    @NotNull
    private Boolean status;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role role;

    @OneToOne(mappedBy = "user")
    @JsonIgnore
    private Aspect aspect;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Report> reports;
}
