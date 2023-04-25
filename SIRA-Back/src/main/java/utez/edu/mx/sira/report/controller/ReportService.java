package utez.edu.mx.sira.report.controller;

import net.sf.jasperreports.engine.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ResourceUtils;
import utez.edu.mx.sira.aspect.model.Aspect;
import utez.edu.mx.sira.aspect.model.AspectRepository;
import utez.edu.mx.sira.report.model.Report;
import utez.edu.mx.sira.report.model.ReportRepository;
import utez.edu.mx.sira.user.model.UserRepository;
import utez.edu.mx.sira.utils.CustomResponse;

import javax.sql.DataSource;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;

@Service
@Transactional
public class ReportService {
    @Autowired
    private ReportRepository repository;
    @Autowired
    private AspectRepository aspectRepository;
    @Autowired
    private DataSource dataSource;

    @Transactional(readOnly = true)
    public CustomResponse<List<Report>> findAll() {
        return new CustomResponse<>(
                repository.findAll(),
                false,
                200,
                "OK"
        );
    }

    @Transactional(readOnly = true)
    public CustomResponse<List<Report>> findByAspect(long id) {
        boolean exists = aspectRepository.existsById(id);
        if (exists) {
            Aspect aspect = aspectRepository.findById(id).get();
            return new CustomResponse<>(
                    repository.findByAspect(aspect),
                    false,
                    200,
                    "OK"
            );
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "Aspect not found"
            );
        }
    }

    @Transactional(readOnly = true)
    public CustomResponse<List<Report>> findByAspectAndStatus(String aspect_name, boolean status) {
        boolean exists = aspectRepository.existsByName(aspect_name);
        if (exists) {
            Aspect aspect = aspectRepository.findByName(aspect_name);
            return new CustomResponse<>(
                    repository.findByAspectAndStatus(aspect, status),
                    false,
                    200,
                    "OK"
            );
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "Aspect not found"
            );
        }
    }

    @Transactional(readOnly = true)
    public CustomResponse<List<Report>> findByStatus(boolean status) {
        return new CustomResponse<>(
                repository.findByStatus(status),
                false,
                200,
                "OK"
        );
    }

    @Transactional(readOnly = true)
    public CustomResponse<Integer> countByDateAndAspect(String aspect_name, String first_date, String last_date) {
        boolean exists = aspectRepository.existsByName(aspect_name);
        if (exists) {
            Aspect aspect = aspectRepository.findByName(aspect_name);
            return new CustomResponse<>(
                    repository.countByDateAndAspect(first_date, last_date, aspect.getId()),
                    false,
                    200,
                    "OK"
            );
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "Aspect not found"
            );
        }
    }
    @Transactional(readOnly = true)
    public CustomResponse<Integer> countByDateAndStatusDone(String aspect_name, String first_date, String last_date) {
        boolean exists = aspectRepository.existsByName(aspect_name);
        if (exists) {
            Aspect aspect = aspectRepository.findByName(aspect_name);
            return new CustomResponse<>(
                    repository.countByDateAndStatus(first_date, last_date, aspect.getId(), false),
                    false,
                    200,
                    "OK"
            );
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "Aspect not found"
            );
        }
    }
    @Transactional(readOnly = true)
    public CustomResponse<Integer> countByDateAndStatusPending(String aspect_name, String first_date, String last_date) {
        boolean exists = aspectRepository.existsByName(aspect_name);
        if (exists) {
            Aspect aspect = aspectRepository.findByName(aspect_name);
            return new CustomResponse<>(
                    repository.countByDateAndStatus(first_date, last_date, aspect.getId(), true),
                    false,
                    200,
                    "OK"
            );
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "Aspect not found"
            );
        }
    }

    @Transactional(readOnly = true)
    public CustomResponse<Report> findOne(long id) {
        boolean exists = repository.existsById(id);
        if (exists) {
            return new CustomResponse<>(
                    repository.findById(id).get(),
                    false,
                    200,
                    "OK"
            );
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "Report not found"
            );
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public CustomResponse<Report> save(Report report) {
        if (aspectRepository.existsByName(report.getAspect().getName())) {
            Aspect aspect = aspectRepository.findByName(report.getAspect().getName());
            report.setAspect(aspect);
            if (aspect.getStatus()) {
                report.setUser(aspect.getUser());
                report.setStatus(true);
                report.setDate_end(null);
                return new CustomResponse<>(
                        repository.saveAndFlush(report),
                        false,
                        200,
                        "Report saved successfully"
                );
            } else {
                return new CustomResponse<>(
                        null,
                        true,
                        400,
                        "Aspect disabled"
                );
            }
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "Aspect not found"
            );
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public CustomResponse<Report> updateStatus(long id, Date date) {
        boolean exists = repository.existsById(id);
        if (exists) {
            if (repository.findById(id).get().getStatus() && repository.findById(id).get().getDate_end() == null) {
                Report report = repository.findById(id).get();
                report.setStatus(false);
                report.setDate_end(date);
                return new CustomResponse<>(
                        repository.saveAndFlush(report),
                        false,
                        200,
                        "Report completed successfully"
                );
            } else {
                return new CustomResponse<>(
                        null,
                        true,
                        400,
                        "Report already completed"
                );
            }
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "Report not found"
            );
        }

    }

    public JasperPrint exportReport(long id) throws FileNotFoundException, JRException, SQLException {
        try(Connection conn = dataSource.getConnection()){
            File plantilla = ResourceUtils.getFile("classpath:static/ReporteInsidencia.jrxml");
            File logoUtez = ResourceUtils.getFile("classpath:assets/Logo-utez.png");
            File footer = ResourceUtils.getFile("classpath:assets/footer.png");
            File logoRec = ResourceUtils.getFile("classpath:assets/logoRec.jpg");
            File noimage = ResourceUtils.getFile("classpath:assets/noImage.png");
            JasperReport jasperReport = JasperCompileManager.compileReport( plantilla.getAbsolutePath());
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("id", id);
            parameters.put("sga", new FileInputStream(logoRec));
            parameters.put("utez", new FileInputStream(logoUtez));
            parameters.put("footer", new FileInputStream(footer));
            parameters.put("noimage", new FileInputStream(noimage));
            return JasperFillManager.fillReport(jasperReport, parameters, conn);
        }
    }
    public JasperPrint exportReportByDateRange(String first_date, String last_date, long id) throws FileNotFoundException, JRException, SQLException{
        try(Connection conn = dataSource.getConnection()){
            int count = repository.countByDateAndAspect(first_date, last_date,id);
            File plantilla = ResourceUtils.getFile("classpath:static/ReporteporFecha.jrxml");
            File logoUtez = ResourceUtils.getFile("classpath:assets/Logo-utez.png");
            File footer = ResourceUtils.getFile("classpath:assets/footer.png");
            File logoRec = ResourceUtils.getFile("classpath:assets/logoRec.jpg");
            JasperReport jasperReport = JasperCompileManager.compileReport( plantilla.getAbsolutePath());
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("id", id);
            parameters.put("first_date", first_date);
            parameters.put("last_date", last_date);
            parameters.put("counter", count);
            parameters.put("sga", new FileInputStream(logoRec));
            parameters.put("utez", new FileInputStream(logoUtez));
            parameters.put("footer", new FileInputStream(footer));
            return JasperFillManager.fillReport(jasperReport, parameters, conn);
        }
    }

    public JasperPrint getAllReportsByDate(String first_date, String last_date)throws FileNotFoundException, JRException, SQLException{
        try(Connection conn = dataSource.getConnection()){
            int count = repository.countAllReportsByDate(first_date, last_date);
            File plantilla = ResourceUtils.getFile("classpath:static/ReporteporMes.jrxml");
            File logoUtez = ResourceUtils.getFile("classpath:assets/Logo-utez.png");
            File footer = ResourceUtils.getFile("classpath:assets/footer.png");
            File logoRec = ResourceUtils.getFile("classpath:assets/logoRec.jpg");
            JasperReport jasperReport = JasperCompileManager.compileReport( plantilla.getAbsolutePath());
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("first_date", first_date);
            parameters.put("last_date", last_date);
            parameters.put("counter", count);
            parameters.put("sga", new FileInputStream(logoRec));
            parameters.put("utez", new FileInputStream(logoUtez));
            parameters.put("footer", new FileInputStream(footer));
            return JasperFillManager.fillReport(jasperReport, parameters, conn);
        }
    }
}