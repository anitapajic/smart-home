package com.example.smarthome.DTO.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetDTO {
    private String username;
    private Integer code;
    private String newPassword;
    private String newConfirmed;

}
