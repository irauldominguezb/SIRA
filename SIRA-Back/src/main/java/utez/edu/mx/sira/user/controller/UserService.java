package utez.edu.mx.sira.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utez.edu.mx.sira.aspect.model.AspectRepository;
import utez.edu.mx.sira.role.model.Role;
import utez.edu.mx.sira.role.model.RoleRepository;
import utez.edu.mx.sira.user.model.User;
import utez.edu.mx.sira.user.model.UserRepository;
import utez.edu.mx.sira.utils.CustomResponse;


import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public CustomResponse<List<User>> findAll() {
        return new CustomResponse<>(
                userRepository.findAll(),
                false,
                200,
                "OK"
        );
    }

    @Transactional(readOnly = true)
    public CustomResponse<User> findOne(long id) {
        boolean exists = userRepository.existsById(id);
        if (exists) {
            return new CustomResponse<>(
                    userRepository.findById(id).get(),
                    false,
                    200,
                    "OK"
            );
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "User not found"
            );
        }
    }

    @Transactional(readOnly = true)
    public CustomResponse<List<User>> findByStatusAndRole(boolean status, String role) {
        boolean exists = roleRepository.existsByName(role);
        if (exists) {
            Role role_object = roleRepository.findByName(role);
            return new CustomResponse<>(
                    userRepository.findByStatusAndRole(status, role_object),
                    false,
                    200,
                    "OK"
            );
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "Role does not exist"
            );
        }
    }


    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.getByEmail(email);
    }

    @Transactional(rollbackFor = {Exception.class})
    public CustomResponse<User> save(User user) {
        boolean exists = userRepository.existsById(user.getId());
        if (exists) {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "User already exists"
            );
        } else {
            if (roleRepository.existsByName(user.getRole().getName())) {
                user.setRole(roleRepository.findByName(user.getRole().getName()));
                user.setStatus(true);
                return new CustomResponse<>(
                        userRepository.saveAndFlush(user),
                        false,
                        200,
                        "User saved successfully"
                );
            } else {
                return new CustomResponse<>(
                        null,
                        true,
                        400,
                        "Role does not exist"
                );
            }
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public CustomResponse<User> update(long id, User user) {
        boolean exists = userRepository.existsById(id);
        if (exists) {
            user.setId(id);
            User _user = userRepository.findById(id).get();
            if (_user.getStatus() == user.getStatus()) {
                if (roleRepository.existsByName(user.getRole().getName())) {
                    if (user.getRole().getName().equals("Administrador")) {
                        if (user.getStatus()) {
                            user.setRole(roleRepository.findByName(user.getRole().getName()));
                            return new CustomResponse<>(
                                    userRepository.saveAndFlush(user),
                                    false,
                                    200,
                                    "User updated successfully"
                            );
                        } else {
                            return new CustomResponse<>(
                                    null,
                                    true,
                                    400,
                                    "User occupied as an aspect manager"
                            );
                        }
                    } else {
                        user.setRole(roleRepository.findByName(user.getRole().getName()));
                        return new CustomResponse<>(
                                userRepository.saveAndFlush(user),
                                false,
                                200,
                                "User updated successfully"
                        );
                    }
                } else {
                    return new CustomResponse<>(
                            null,
                            true,
                            400,
                            "Role does not exist"
                    );
                }
            } else {
                return new CustomResponse<>(
                        null,
                        true,
                        400,
                        "User status cannot be changed"
                );
            }
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "User does not exist"
            );
        }
    }

    @Transactional(rollbackFor = {Exception.class})
    public CustomResponse<User> updatePassword(long id, String password) {
        User user = userRepository.findById(id).get();
        user.setPassword(password);
        return new CustomResponse<>(
                userRepository.saveAndFlush(user),
                false,
                200,
                "User updated successfully"
        );
    }
}
