package com.example.smarthome.service;

import com.example.smarthome.model.RealEstate;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    void sendVerificationMail(String username, Integer id) throws MessagingException, UnsupportedEncodingException {
        String subject = "Please verify your account";
        String senderName = "SmartHome App";

        String mailContent =
                "<!DOCTYPE html>" +
                        "<html>" +
                        "<head>" +
                        "<link href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css\" rel=\"stylesheet\">" +
                        "<style type=\"text/css\">" +
                        "body, p, h1 {" +
                        "font-family: Verdana, Arial, sans-serif;" +
                        "}" +
                        ".button {" +
                        "  background-color: #263d3d;" +
                        "  border-radius: 20px;" +
                        "  border: 1px solid #b4e854;" +
                        "  color: white;" +
                        "  padding: 12px 45px;" +
                        "  text-align: center;" +
                        "  text-decoration: none;" +
                        "  display: inline-block;" +
                        "  font-size: 16px;" +
                        "  margin: 4px 2px;" +
                        "  cursor: pointer;" +
                        "}" +
                        ".container {" +
                        "text-align: center;" +
                        "max-width: 750px;" +
                        "margin: auto;" +
                        "}" +
                        ".header {" +
                        "background-color: #263d3d;" +
                        "padding: 7px;" +
                        "}" +
                        ".header-title {" +
                        "color: #b4e854;" +
                        "font-size: 24px;" +
                        "}" +
                        ".body-content {" +
                        "margin: 20px 0;" +
                        "}" +
                        ".footer {" +
                        "background-color: #eeeeee;" +
                        "color: #333333;" +
                        "text-align: center;" +
                        "padding: 40px;" +
                        "margin-top: 20px;" +
                        "}" +
                        ".social-icons a {" +
                        "margin: 10px;" +
                        "color: darkgreen;" +
                        "font-size: 24px;" +
                        "text-decoration: none;" +
                        "cursor: pointer;" +
                        "padding: 20px 0;" +
                        "}" +
                        ".contact-info p {" +
                        "margin: 0;" +
                        "font-size: 14px;" +
                        "padding: 5px;" +
                        "}" +
                        ".password {" +
                        "color: #b4e854;" +
                        "}" +
                        "</style>" +
                        "</head>" +
                        "<body>" +
                        "<div class=\"container\">" +
                        "<div class=\"header\">" +
                        "<p class=\"header-title\">Smart Home</p>" +
                        "</div>" +
                        "<div class=\"body-content\">" +
                        "<h1>Change Your Password</h1>" +
                        "<p>Dear user,</p>" +
                        "<p>Please click the button below to verify your account:</p>" +
                        "<a href=\"http://localhost:8085/api/user/activate/" + id + "\">" +
                        "<button class=\"button\">VERIFY</button>" +
                        "</a>" +
                        "<p>Thank you!<br>SmartHome App</p>" +
                        "</div>" +
                        "<div class=\"footer\">" +
                        "<div class=\"social-icons\">" +
                        "</div>" +
                        "<div class=\"contact-info\">" +
                        "<p>Phone: 123-456-7890</p>" +
                        "<p>Email: info@example.com</p>" +
                        "<p>Address: 1234 Street, City, Country</p>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</body>" +
                        "</html>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("UberAppTim19@gmail.com", senderName);
        helper.setTo("aleksandrafilipic22@gmail.com");  //username
        helper.setSubject(subject);
        helper.setText(mailContent, true);

        mailSender.send(message);
    }
    @Async
    void sendRestCodeMail(String username, Integer id) throws MessagingException, UnsupportedEncodingException {
        String subject = "Reset code";
        String senderName = "SmartHome App";

        String mailContent = "<p>Dear, user </p>";
        mailContent +="<p>Your reset code is:</p>";
        mailContent +="<h3>"+id+"</h3>";
        mailContent +="<p>Thank you!<br>SmartHome App </p>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("UberAppTim19@gmail.com", senderName);
        helper.setTo("aleksandrafilipic22@gmail.com");  //username
        helper.setSubject(subject);
        helper.setText(mailContent, true);

        mailSender.send(message);
    }


    @Async
    void sentStatusMail(RealEstate realEstate, String reason) throws MessagingException, UnsupportedEncodingException {
        String subject = "Real estate status";
        String senderName = "SmartHome App";

        String mailContent =
                "<!DOCTYPE html>" +
                        "<html>" +
                        "<head>" +
                        "<link href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css\" rel=\"stylesheet\">" +
                        "<style type=\"text/css\">" +
                        "body, p, h1 {" +
                        "font-family: Verdana, Arial, sans-serif;" +
                        "}" +
                        ".button {" +
                        "  background-color: #263d3d;" +
                        "  border-radius: 20px;" +
                        "  border: 1px solid #b4e854;" +
                        "  color: white;" +
                        "  padding: 12px 45px;" +
                        "  text-align: center;" +
                        "  text-decoration: none;" +
                        "  display: inline-block;" +
                        "  font-size: 16px;" +
                        "  margin: 4px 2px;" +
                        "  cursor: pointer;" +
                        "}" +
                        ".container {" +
                        "text-align: center;" +
                        "max-width: 750px;" +
                        "margin: auto;" +
                        "}" +
                        ".header {" +
                        "background-color: #263d3d;" +
                        "padding: 7px;" +
                        "}" +
                        ".header-title {" +
                        "color: #b4e854;" +
                        "font-size: 24px;" +
                        "}" +
                        ".body-content {" +
                        "margin: 20px 0;" +
                        "}" +
                        ".footer {" +
                        "background-color: #eeeeee;" +
                        "color: #333333;" +
                        "text-align: center;" +
                        "padding: 40px;" +
                        "margin-top: 20px;" +
                        "}" +
                        ".social-icons a {" +
                        "margin: 10px;" +
                        "color: darkgreen;" +
                        "font-size: 24px;" +
                        "text-decoration: none;" +
                        "cursor: pointer;" +
                        "padding: 20px 0;" +
                        "}" +
                        ".contact-info p {" +
                        "margin: 0;" +
                        "font-size: 14px;" +
                        "padding: 5px;" +
                        "}" +
                        ".password {" +
                        "color: #b4e854;" +
                        "}" +
                        "</style>" +
                        "</head>" +
                        "<body>" +
                        "<div class=\"container\">" +
                        "<div class=\"header\">" +
                        "<p class=\"header-title\">Smart Home</p>" +
                        "</div>" +
                        "<div class=\"body-content\">" +
                        "<h1>Change Your Password</h1>" +
                        "<p>Your real estate <b style=\"color: #b4e854;\">" + realEstate.getName() + "</b> is: </p>" +
                        "<h3 style=\"font-size: 24px; color: red;\">" + realEstate.getStatus() + "</h3>";

        if (reason.length() > 0) {
            mailContent += "<p>Reason: " + reason + "</p>";
        }

        mailContent += "<p><br>SmartHome App </p>" +
                "</div>" +
                "<div class=\"footer\">" +
                "<div class=\"social-icons\">" +
                "</div>" +
                "<div class=\"contact-info\">" +
                "<p>Phone: 123-456-7890</p>" +
                "<p>Email: info@example.com</p>" +
                "<p>Address: 1234 Street, City, Country</p>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";


        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("UberAppTim19@gmail.com", senderName);
        helper.setTo("aleksandrafilipic22@gmail.com");  //username
        helper.setSubject(subject);
        helper.setText(mailContent, true);

        mailSender.send(message);
    }
}