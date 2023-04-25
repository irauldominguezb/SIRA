package utez.edu.mx.sira.report.controller;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sira.aspect.model.Aspect;
import utez.edu.mx.sira.aspect.model.AspectRepository;
import utez.edu.mx.sira.report.model.Report;
import utez.edu.mx.sira.user.model.UserRepository;
import utez.edu.mx.sira.utils.CustomResponse;
import utez.edu.mx.sira.utils.EmailService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.websocket.server.PathParam;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api-sira/report")
@CrossOrigin(origins = {"*"})
public class ReportController {
    @Autowired
    private ReportService reportService;
    @Autowired
    private AspectRepository aspectRepository;
    @Autowired
    private EmailService emailService;

    @GetMapping("/")
    public ResponseEntity<CustomResponse<List<Report>>> getAll(){
        return new ResponseEntity<>(
                this.reportService.findAll(),
                HttpStatus.OK
        );
    }

    @GetMapping("/aspect/{name}/")
    public ResponseEntity<CustomResponse<List<Report>>> getByAspect(@PathVariable String name){
        Aspect aspect = aspectRepository.findByName(name);
        return new ResponseEntity<>(
                this.reportService.findByAspect(aspect.getId()),
                HttpStatus.OK
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<CustomResponse<List<Report>>> getByStatus(@PathVariable boolean status){
        return new ResponseEntity<>(
                this.reportService.findByStatus(status),
                HttpStatus.OK
        );
    }

    @GetMapping("/aspect/{aspect_name}/status/{status}")
    public ResponseEntity<CustomResponse<List<Report>>> getByAspectAndStatus(@PathVariable String aspect_name, @PathVariable boolean status){
        return new ResponseEntity<>(
                this.reportService.findByAspectAndStatus(aspect_name, status),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<Report>> getOne(@PathVariable long id){
        return new ResponseEntity<>(
                this.reportService.findOne(id),
                HttpStatus.OK
        );
    }

    @GetMapping("/aspect/{aspect}/{first_date}/{last_date}")
    public ResponseEntity<CustomResponse<Integer>> countByDateAndAspect(@PathVariable String aspect, @PathVariable String first_date, @PathVariable String last_date){
        return new ResponseEntity<>(
                this.reportService.countByDateAndAspect(aspect, first_date, last_date),
                HttpStatus.OK
        );
    }
    @GetMapping("/aspect/done/{aspect}/{first_date}/{last_date}")
    public ResponseEntity<CustomResponse<Integer>> countByDateAndStatusDone(@PathVariable String aspect, @PathVariable String first_date, @PathVariable String last_date){
        return new ResponseEntity<>(
                this.reportService.countByDateAndStatusDone(aspect, first_date, last_date),
                HttpStatus.OK
        );
    }
    @GetMapping("/aspect/pending/{aspect}/{first_date}/{last_date}")
    public ResponseEntity<CustomResponse<Integer>> countByDateAndStatusPending(@PathVariable String aspect, @PathVariable String first_date, @PathVariable String last_date){
        return new ResponseEntity<>(
                this.reportService.countByDateAndStatusPending(aspect, first_date, last_date),
                HttpStatus.OK
        );
    }

    @PostMapping("/")
    public ResponseEntity<CustomResponse<Report>> insert(@Valid @RequestBody ReportDTO reportDTO) {
        Report report = reportDTO.castToReport();
        report.setStatus(true);
        report.setDate_end(null);
        return new ResponseEntity<>(
                this.reportService.save(report),
                HttpStatus.OK
        );
    }

    @PostMapping("/sendMail")
    public ResponseEntity<CustomResponse<Boolean>> sendMail(@Valid @RequestBody ReportDTO reportDTO) {
        Report report = reportDTO.castToReport();
        report.setAspect(aspectRepository.findByName(report.getAspect().getName()));
        report.setUser(report.getAspect().getUser());
        report.setStatus(true);
        report.setDate_end(null);
        System.out.println(report.getUser().getEmail());
        if (emailService.sendMail(report)) {
            return new ResponseEntity<>(
                    new CustomResponse<>(
                            true,
                            false,
                            200,
                            "Email sent successfully"
                    ),
                    HttpStatus.OK
            );
        } else {
            return new ResponseEntity<>(
                    new CustomResponse<>(
                            false,
                            true,
                            400,
                            "Error sending email"
                    ),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    @GetMapping("/generateReport/{id}")
    @ResponseBody
    public void generateReport(HttpServletResponse response, @PathVariable long id) throws JRException, IOException, SQLException {
        JasperPrint jasperPrint = reportService.exportReport(id);
        response.setContentType("application/x-pdf");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMdd");
        String timestamp = LocalDateTime.now().format(formatter);
        String fileName = "ReportedeIncidencia_" +timestamp+"_"+ id+".pdf";

        response.setHeader("Content-Disposition", "attachment;filename="+fileName);
        OutputStream outputStream = response.getOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
        response.setStatus(200);
    }

    @GetMapping("/generateReport/{id}/{first_date}/{last_date}")
    @ResponseBody
    public void generateRangeReport(HttpServletResponse response, @PathVariable long id, @PathVariable String first_date, @PathVariable String last_date) throws JRException, SQLException, IOException {
        JasperPrint jasperPrint = reportService.exportReportByDateRange(first_date, last_date, id);
        response.setContentType("application/x-pdf");
        String fileName = "ReporteporRangodeFecha_" +first_date+"-"+last_date+"_"+id+".pdf";
        response.setHeader("Content-Disposition", "attachment; filename="+fileName);
        OutputStream outputStream = response.getOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
        response.setStatus(200);
    }

    @GetMapping("generateReport/{first_date}/{last_date}")
    @ResponseBody
    public void generateReportByDate(HttpServletResponse response, @PathVariable String first_date, @PathVariable String last_date) throws JRException, SQLException, IOException{
        JasperPrint jasperPrint = reportService.getAllReportsByDate(first_date, last_date);
        response.setContentType("application/x-pdf");
        String fileName = "ReporteGeneralporFecha_" +first_date+"-"+last_date+".pdf";
        response.setHeader("Content-Disposition", "attachment; filename="+fileName);
        OutputStream outputStream = response.getOutputStream();
        JasperExportManager.exportReportToPdfStream(jasperPrint, outputStream);
        response.setStatus(200);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CustomResponse<Report>> updateStatus(@PathVariable long id, @Valid @RequestBody ReportDTO reportDTO) {
        return new ResponseEntity<>(
                this.reportService.updateStatus(id, reportDTO.castToReport().getDate_end()),
                HttpStatus.OK
        );
    }
}
