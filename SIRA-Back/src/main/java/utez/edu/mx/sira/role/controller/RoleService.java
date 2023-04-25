package utez.edu.mx.sira.role.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.sira.role.model.Role;
import utez.edu.mx.sira.role.model.RoleRepository;
import utez.edu.mx.sira.utils.CustomResponse;

import java.util.List;

@Service
@Transactional
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public CustomResponse<List<Role>> findAll() {
        return new CustomResponse<>(
                roleRepository.findAll(),
                false,
                200,
                "OK"
        );
    }

    @Transactional(readOnly = true)
    public CustomResponse<Role> findOne(long id) {
        boolean exists = roleRepository.existsById(id);
        if (exists) {
            return new CustomResponse<>(
                    roleRepository.findById(id).get(),
                    false,
                    200,
                    "OK"
            );
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "Role not found"
            );
        }
    }
}
