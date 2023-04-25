package utez.edu.mx.sira.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sira.user.model.User;
import utez.edu.mx.sira.user.model.UserRepository;
import utez.edu.mx.sira.utils.CustomResponse;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api-sira/user")
@CrossOrigin(origins = {"*"})
public class UserController {
    @Autowired
    private UserService service;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    public ResponseEntity<CustomResponse<List<User>>> getAll(){
        return new ResponseEntity<>(
                this.service.findAll(),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<User>> getOne(@PathVariable long id){
        return new ResponseEntity<>(
                this.service.findOne(id),
                HttpStatus.OK
        );
    }

    @GetMapping("/role/{role}/status/{status}")
    public ResponseEntity<CustomResponse<List<User>>> getByStatusAndRole(@PathVariable boolean status, @PathVariable String role){
        return new ResponseEntity<>(
                this.service.findByStatusAndRole(status, role),
                HttpStatus.OK
        );
    }

    @PostMapping("/")
    public ResponseEntity<CustomResponse<User>> insert(@Valid @RequestBody UserDTO user){
        return new ResponseEntity<>(
                this.service.save(
                        new User(
                                user.getId(),
                                user.getEmail(),
                                passwordEncoder.encode(user.getPassword()),
                                user.getFullname(),
                                user.getStatus(),
                                user.getRole(),
                                null,
                                null
                )),
                HttpStatus.OK
        );
    }

    @PatchMapping("/updatePassword/{id}")
    public ResponseEntity<CustomResponse<User>> updatePassword(@PathVariable long id, @Valid @RequestBody UpdatePasswordDTO user){
        boolean exists = userRepository.existsById(id);
        if (exists) {
            User user1 = userRepository.findById(id).get();
            boolean validation = passwordEncoder.matches(user.getOldPassword(), user1.getPassword());
            System.out.println(validation);
            if (validation) {
                return new ResponseEntity<>(
                        this.service.updatePassword(id, passwordEncoder.encode(user.getNewPassword())),
                        HttpStatus.OK
                );
            } else {
                return new ResponseEntity<>(
                        new CustomResponse<>(
                                null,
                                true,
                                400,
                                "Old password is incorrect"
                        ),
                        HttpStatus.OK
                );
            }
        }else{
            return new ResponseEntity<>(
                    new CustomResponse<>(
                            null,
                            true,
                            400,
                            "User not found"
                    ),
                    HttpStatus.OK
            );
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomResponse<User>> update(@PathVariable long id, @Valid @RequestBody UserDTO user){
        return new ResponseEntity<>(
                this.service.update(id, new User(
                        user.getId(),
                        user.getEmail(),
                        passwordEncoder.encode(user.getPassword()),
                        user.getFullname(),
                        user.getStatus(),
                        user.getRole(),
                        null,
                        null
                )),
                HttpStatus.OK
        );
    }
}
