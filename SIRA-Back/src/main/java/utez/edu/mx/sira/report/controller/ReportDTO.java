package utez.edu.mx.sira.report.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import utez.edu.mx.sira.aspect.model.Aspect;
import utez.edu.mx.sira.report.model.Report;
import utez.edu.mx.sira.user.model.User;

import javax.persistence.Column;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReportDTO {
    private long id;

    private String description;

    private String latitude;

    private String longitude;

    private String location_description;

    private String photo;

    private Date date_start;

    private Date date_end;

    private Boolean status;

    private User user;

    private Aspect aspect;

    public Report castToReport(){
        return new Report(
                getId(),
                getDescription(),
                getLatitude(),
                getLongitude(),
                getLocation_description(),
                getPhoto(),
                getDate_start(),
                getDate_end(),
                getStatus(),
                getUser(),
                getAspect()
        );
    }
}
