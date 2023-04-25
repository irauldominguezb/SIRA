package utez.edu.mx.sira.report.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import utez.edu.mx.sira.aspect.model.Aspect;

import java.util.Calendar;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByAspect(Aspect aspect);
    List<Report> findByStatus(boolean status);
    List<Report> findByAspectAndStatus(Aspect aspect, boolean status);
    @Query(
                value = "select count(date_start) from reports where date_start > :first_date && date_start <= :last_date && aspect_id = :id",
            nativeQuery = true
    )
    int countByDateAndAspect(String first_date, String last_date, long id);
    @Query(
            value = "select count(date_start) from reports where date_start > :first_date && date_start <= :last_date && aspect_id = :id && status = :status",
            nativeQuery = true
    )
    int countByDateAndStatus(String first_date, String last_date,long id ,boolean status);

    @Query(
        value = "select count(date_start) from reports where date_start > :first_date && date_start <= :last_date",
            nativeQuery = true
    )
    int countAllReportsByDate(String first_date, String last_date);
}
