package utez.edu.mx.sira.report.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import utez.edu.mx.sira.aspect.model.Aspect;
import utez.edu.mx.sira.user.model.User;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "reports")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull
    private String description;

    @NotNull
    private String latitude;

    @NotNull
    private String longitude;

    @NotNull
    private String location_description;

    @Column(columnDefinition = "text")
    private String photo;

    @NotNull
    private Date date_start;

    private Date date_end;

    @NotNull
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "aspect_id")
    private Aspect aspect;
}
