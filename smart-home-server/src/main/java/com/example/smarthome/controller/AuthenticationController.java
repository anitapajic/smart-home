package com.example.smarthome.controller;


import com.example.smarthome.DTO.Auth.LoginDTO;
import com.example.smarthome.DTO.User.ResetDTO;
import com.example.smarthome.DTO.Auth.TokenDTO;
import com.example.smarthome.DTO.User.UserDTO;
import com.example.smarthome.service.JWTService;
import com.example.smarthome.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;


@CrossOrigin(value="*")
@RestController
@RequestMapping(value = "/api/user")
public class AuthenticationController {

    @Value("${secretPsw}")
    String secretPsw;

    @Autowired
    private UserService userService;
    @Autowired
    JWTService jwtProvider;
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;


    @PostMapping(
            value = "/register",
            consumes = "application/json")
    public ResponseEntity registration(@RequestBody UserDTO userDTO){

        HashMap<String, String> resp = new HashMap<>();
        simpMessagingTemplate.convertAndSend("smart-home", "TEST MESSAGE2");

        try{
            userService.createNewUser(userDTO);
            return new ResponseEntity<>(resp.put("response","Check your email"), HttpStatus.CREATED);
        }
        catch (Exception e){
            System.out.println(e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }


    @PostMapping(
            value = "/registerAdmin",
            consumes = "application/json")
    @PreAuthorize("hasAnyAuthority('SUPERADMIN')")
    public ResponseEntity adminRegistration(@RequestBody UserDTO userDTO){

        HashMap<String, String> resp = new HashMap<>();

        try{
            userService.createNewAdmin(userDTO);
            return new ResponseEntity<>(resp.put("response","Check your email"), HttpStatus.CREATED);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }
    //ACTIVATE USER ACCOUNT  /api/user/activate/userId
    @GetMapping(value = "/activate/{userId}")
    public ResponseEntity activateAccount(@PathVariable Integer userId) {
        userService.activate(userId);
        return new ResponseEntity<>("Successfully activated", HttpStatus.OK);
    }


    @PostMapping(
            value = "/login",
            consumes = "application/json")
    public ResponseEntity login(@RequestBody LoginDTO loginDTO){
        try {
            this.simpMessagingTemplate.convertAndSend("smart-home", "TEST MESSAGE");

            TokenDTO auth = userService.login(loginDTO.getUsername(), loginDTO.getPassword());
            return new ResponseEntity<>(auth, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);

        }
    }

    @PostMapping(
            value = "/changePassword",
            consumes = "application/json")
    @PreAuthorize("hasAnyAuthority('ADMIN','SUPERADMIN')")

    public ResponseEntity changePassword(@RequestBody LoginDTO loginDTO){
        try {
            TokenDTO auth = userService.changePassword(loginDTO.getUsername(), loginDTO.getPassword());
            return new ResponseEntity<>(auth, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);

        }
    }



    @GetMapping(
            value = "/logout")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity logout(){
        return new ResponseEntity<>("Logout", HttpStatus.OK);
    }




    @GetMapping(value = "/reset/{username}")
    public ResponseEntity getResetCode(@PathVariable String username) {
        try{
            userService.sendResetCode(username);
            return new ResponseEntity<>(new HashMap<String, String>() {{ put("response", "Check your mail"); }}, HttpStatus.CREATED);

        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);

        }

    }

    @PostMapping(value = "/reset")
    public ResponseEntity resetPassword(@RequestBody ResetDTO resetDTO) {

        try{
            userService.resetPassword(resetDTO);
            return new ResponseEntity<>(new HashMap<String, String>() {{ put("response", "Successfully changed password"); }}, HttpStatus.OK);

        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);

        }

    }


}
