package com.example.smarthome.service;

import com.example.smarthome.DTO.User.ResetDTO;
import com.example.smarthome.DTO.Auth.TokenDTO;
import com.example.smarthome.DTO.User.UserDTO;
import com.example.smarthome.model.ResetCode;
import com.example.smarthome.model.enums.Role;
import com.example.smarthome.model.User;
import com.example.smarthome.repository.ResetCodeRepository;
import com.example.smarthome.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ResetCodeRepository resetCodeRepository;
    @Autowired
    private JWTService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private MailService mailService;

    public User findByUsername(String username){
        return userRepository.findByUsername(username).orElse(null);
    }
     public void createSuperAdmin() {
        Optional<User> u = userRepository.findByUsername("admin");
        if(u.isPresent()){
            return;
        }
        User user = new User();
        user.setUsername("admin");
        user.setName("admin");
        user.setProfilePicture(null);
        String pass = randPassword(12);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(pass));
        user.setRole(Role.SUPERADMIN);
        user.setIsActive(false);
        userRepository.save(user);

        System.out.println("SUPERADMIN USERNAME: " + user.getUsername());
        System.out.println("SUPERADMIN PASSWORD: " + pass);
    }

    public void createNewUser(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setName(userDTO.getName());
        user.setProfilePicture(userDTO.getPicture());
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole(Role.USER);
        user.setIsActive(false);

        try {
            user = userRepository.save(user);
            mailService.sendVerificationMail(user.getUsername(), user.getId());
        }catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Username already exists", e);
        }
        catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Verification mail failed",e);
        }
    }

    public void createNewAdmin(UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setName(userDTO.getName());
        user.setProfilePicture(userDTO.getPicture());
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole(Role.ADMIN);

        //mora da promeni sifru
        user.setIsActive(false);

        try {
            userRepository.save(user);
        }catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Username already exists", e);
        }
    }

    public void activate(Integer userId)throws RuntimeException{
        User user = userRepository.findOneById(userId);
        user.setIsActive(true);
        userRepository.save(user);
    }

    public TokenDTO login(String username, String password) throws RuntimeException{
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        User user;
        try {
            Optional<User> u = userRepository.findByUsername(username);
            user = u.orElseThrow(() -> new UsernameNotFoundException("User not found"));
        } catch (UsernameNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching user data", e);
        }

        if(!user.getIsActive() && user.getRole() == Role.USER){
            throw new RuntimeException("User is not active");
        }

        String jwtToken = jwtService.generateToken(user);
        if(!user.getIsActive() && user.getRole() != Role.USER){
            return new TokenDTO(jwtToken, user.getId(), user.getRole().name(), true);
        }
        return new TokenDTO(jwtToken, user.getId(), user.getRole().name(), false);
    }

    public TokenDTO changePassword(String username, String password) throws RuntimeException{
        User user;
        try {
            Optional<User> u = userRepository.findByUsername(username);
            user = u.orElseThrow(() -> new UsernameNotFoundException("User not found"));
        } catch (UsernameNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching user data", e);
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setIsActive(true);
        String jwtToken = jwtService.generateToken(user);
        return new TokenDTO(jwtToken, user.getId(), user.getRole().name(), false);
    }


    public void sendResetCode(String username) throws MessagingException, UnsupportedEncodingException {
        Integer code = randInt();

        ResetCode resetCode = resetCodeRepository.findOneByUsername(username).orElse(new ResetCode());
        resetCode.setUsername(username);
        resetCode.setCode(code);
        resetCode.setDate(LocalDateTime.now().plusMinutes(15));

        resetCodeRepository.save(resetCode);
        mailService.sendRestCodeMail(username, code);
    }

    public void resetPassword(ResetDTO resetDTO){
        if(!resetDTO.getNewPassword().equals(resetDTO.getNewConfirmed())) {
            throw new RuntimeException("New and confirmed passwords do not match");
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        Optional<User> u = userRepository.findByUsername(resetDTO.getUsername());
        User user = u.get();
        ResetCode resetCode = resetCodeRepository.findOneByUsername(resetDTO.getUsername()).orElse(null);

        try{
            validate(resetCode);
            user.setPassword(passwordEncoder.encode(resetDTO.getNewPassword()));
            userRepository.save(user);
            resetCodeRepository.deleteById(resetCode.getId());
        }
        catch (Exception e){
            throw  e;
        }

    }



    private void validate(ResetCode resetCode) {
        if (resetCode == null){
            throw new RuntimeException("Reset code does not exist");
        }
        if (!resetCode.getCode().equals(resetCode.getCode())) {
            throw new RuntimeException("Passwords do not match");
        }
        if (resetCode.getDate().isBefore(LocalDateTime.now())) {
            resetCodeRepository.deleteById(resetCode.getId());
            throw new RuntimeException("Reset code expired");
        }
    }

    private String randPassword(Integer length){
        String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
        String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String DIGITS = "0123456789";
        String SPECIAL_CHARACTERS = "!@#$%^&*()-_+=<>?";
        String allCharacters = LOWERCASE + UPPERCASE + DIGITS + SPECIAL_CHARACTERS;

        Random random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(allCharacters.length());
            char randomChar = allCharacters.charAt(randomIndex);
            password.append(randomChar);
        }

        return password.toString();
    }

    private Integer randInt(){
        double r = Math.random();
        int randomNum = (int)(r * (9999 - 1000)) + 1000;
        return randomNum;
    }

}
