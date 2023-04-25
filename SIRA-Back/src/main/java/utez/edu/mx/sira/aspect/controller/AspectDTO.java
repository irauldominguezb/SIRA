package utez.edu.mx.sira.aspect.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import utez.edu.mx.sira.aspect.model.Aspect;
import utez.edu.mx.sira.user.model.User;

import javax.validation.constraints.NotEmpty;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AspectDTO {
    private long id;

    private String name;

    private Boolean status;

    private User user;

    public Aspect castToAspect() {
        return new Aspect(
                getId(),
                getName(),
                getStatus(),
                getUser(),
                null
        );
    }
}
