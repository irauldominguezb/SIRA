package utez.edu.mx.sira.aspect.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;
import utez.edu.mx.sira.report.model.Report;
import utez.edu.mx.sira.user.model.User;

@Entity
@Table(name = "aspects")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Aspect {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    private String name;

    @NotNull
    private Boolean status;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "aspect")
    @JsonIgnore
    private List<Report> reports;
}
