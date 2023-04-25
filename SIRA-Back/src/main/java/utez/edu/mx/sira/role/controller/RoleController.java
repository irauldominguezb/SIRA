package utez.edu.mx.sira.role.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sira.role.model.Role;
import utez.edu.mx.sira.utils.CustomResponse;

import java.util.List;

@RestController
@RequestMapping("/api-sira/role")
@CrossOrigin(origins = {"*"})
public class RoleController {
    @Autowired
    private RoleService service;

    @GetMapping("/")
    public ResponseEntity<CustomResponse<List<Role>>> getAll(){
        return new ResponseEntity<>(
                this.service.findAll(),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<Role>> getOne(@PathVariable long id){
        return new ResponseEntity<>(
                this.service.findOne(id),
                HttpStatus.OK
        );
    }
}
