package utez.edu.mx.sira.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import utez.edu.mx.sira.report.model.Report;

import javax.mail.internet.MimeMessage;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

@Component
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public boolean sendMail(Report report){
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(report.getUser().getEmail());
            helper.setSubject("Nuevo Reporte de Incidencia");
            helper.setText(template(report), true);
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public String template(Report report){
        String htmlEmail =
                "<html xmlns=\"http://www.w3.org/1999/xhtml\">\n" +
                        "\n" +
                        "<head>\n" +
                        "    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\n" +
                        "    <title>Reporte de Incidencia</title>\n" +
                        "</head>\n" +
                        "\n" +
                        "<body style=\"background-color: white !important; font-family: Arial, Helvetica, sans-serif !important;\">\n" +
                        "    <div style=\"background-color: white !important; border: 20px solid lightgray !important; border-collapse: collapse;\">\n" +
                        "        <div style=\"width: 100%;\">\n" +
                        "            <table style=\"width: 100%; margin: 0 auto;\">\n" +
                        "                <tr>\n" +
                        "                    <td style=\"margin: 50px 0; width: 50%; padding-left: 30px;\">\n" +
                        "                        <img src=\"https://firebasestorage.googleapis.com/v0/b/sira-f5e90.appspot.com/o/logos%2Flogo-utez.png?alt=media&token=dbaeeb44-7a06-44ac-8e67-3ec00aced660\" alt=\"UNIVERSIDAD TECNOLOGICA EMILIANO ZAPATA\" height=\"60px\" />\n" +
                        "                    </td>\n" +
                        "                    <td style=\"margin: 50px 0 0 auto; width: 50%; text-align: end; padding-right: 30px;\">\n" +
                        "                        <img src=\"https://firebasestorage.googleapis.com/v0/b/sira-f5e90.appspot.com/o/logos%2Flogo-sga.png?alt=media&token=52090a15-3e19-4a27-a6fe-c5efd78ab4ff\" alt=\"SISTEMA DE GESTION AMBIENTAL\" height=\"35px\">\n" +
                        "                    </td>\n" +
                        "                </tr>\n" +
                        "            </table>\n" +
                        "        </div> \n" +
                        "        <p style=\"margin-top: 18px; text-align: center; color: #717173; font-size: 22px;\"><b>Sistema de Gesti&oacute;n Ambiental</b></p>" +
                        "        <p style=\"margin-top: 5px; color: #022e60; text-align: center; font-size: 20px;\"><b>" + report.getAspect().getName() + "</b></p>" +
                        "        <p style=\"text-align: center; font-size: medium; margin-left: 30px; margin-right: 30px; color: black;\"><b>Se ha generado un nuevo reporte de incidencia</b></p>\n" +
                        "        <p style=\"margin-left: 30px; margin-right: 30px;\"><b>Fecha: </b>" + formatDate(report.getDate_start()) + "</p>\n" +
                        "        <p style=\"margin-left: 30px; margin-right: 30px;\"><b>Ubicaci&oacute;n: </b>" + report.getLocation_description() + "</p>\n" +
                        "        <p style=\"text-align: justify; font-size: small; margin-left: 30px; margin-right: 30px;\"><b>Descripci&oacute;n: </b>" + report.getDescription() + "</p>\n" +
                        "    </div>\n" +
                        "</body>\n" +
                        "\n" +
                        "</html>";
        return htmlEmail;
    }

    public String formatDate(Date date) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        date = calendar.getTime();
        return formatter.format(date);
    }
}
