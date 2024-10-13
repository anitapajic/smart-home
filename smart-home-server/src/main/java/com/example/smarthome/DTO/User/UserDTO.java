package com.example.smarthome.DTO.User;

import com.example.smarthome.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Integer id;
    private String username;
    private String name;
    private String password;
    private String picture;

}


