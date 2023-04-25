package utez.edu.mx.sira.security.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sira.security.jwt.JwtProvider;
import utez.edu.mx.sira.user.controller.UserService;
import utez.edu.mx.sira.user.model.User;
import utez.edu.mx.sira.utils.CustomResponse;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api-sira/auth")
@CrossOrigin(origins = {"*"})
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtProvider jwtProvider;
    @Autowired
    UserService userService;

    @PostMapping("/login")
    public ResponseEntity<CustomResponse> login(@Valid @RequestBody LoginDTO loginDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) return new ResponseEntity<>(new CustomResponse(null, true, 400, "Required fields"), HttpStatus.BAD_REQUEST);
        User user = userService.findByEmail(loginDTO.getEmail()).get();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.generateToken(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user_details", userDetails);
        data.put("user", user);
        return new ResponseEntity<>(new CustomResponse(data, false, 200, "OK"), HttpStatus.OK);
    }

}
