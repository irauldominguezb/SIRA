package utez.edu.mx.sira.aspect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utez.edu.mx.sira.aspect.model.Aspect;
import utez.edu.mx.sira.utils.CustomResponse;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api-sira/aspect")
@CrossOrigin(origins = {"*"})
public class AspectController {
    @Autowired
    private AspectService service;

    @GetMapping("/")
    public ResponseEntity<CustomResponse<List<Aspect>>> getAll(){
        return new ResponseEntity<>(
                this.service.findAll(),
                HttpStatus.OK
        );
    }

    @GetMapping("/active")
    public ResponseEntity<CustomResponse<List<Aspect>>> getAllActive(){
        return new ResponseEntity<>(
                this.service.findAllByUserNotNullAndStatusTrue(),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<Aspect>> getOne(@PathVariable long id){
        return new ResponseEntity<>(
                this.service.findOne(id),
                HttpStatus.OK
        );
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<CustomResponse<Aspect>> getByUser(@PathVariable long id){
        return new ResponseEntity<>(
                this.service.findByUser(id),
                HttpStatus.OK
        );
    }

    @PostMapping("/")
    public ResponseEntity<CustomResponse<Aspect>> save(@Valid @RequestBody AspectDTO aspect){
        return new ResponseEntity<>(
                this.service.save(aspect.castToAspect()),
                HttpStatus.OK
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomResponse<Aspect>> update(@PathVariable long id, @Valid @RequestBody AspectDTO aspect){
        return new ResponseEntity<>(
                this.service.update(id, aspect.castToAspect()),
                HttpStatus.OK
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CustomResponse<Aspect>> updateStatus(@PathVariable long id, @Valid @RequestBody AspectDTO aspect){
        return new ResponseEntity<>(
                this.service.updateStatus(id, aspect.castToAspect().getStatus()),
                HttpStatus.OK
        );
    }
}
