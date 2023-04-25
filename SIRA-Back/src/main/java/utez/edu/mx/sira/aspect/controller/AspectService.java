package utez.edu.mx.sira.aspect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import utez.edu.mx.sira.aspect.model.Aspect;
import utez.edu.mx.sira.aspect.model.AspectRepository;
import utez.edu.mx.sira.user.model.User;
import utez.edu.mx.sira.user.model.UserRepository;
import utez.edu.mx.sira.utils.CustomResponse;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AspectService {
    @Autowired
    private AspectRepository aspectRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public CustomResponse<List<Aspect>> findAll() {
        return new CustomResponse<>(
                this.aspectRepository.findAll(),
                false,
                200,
                "OK"
        );
    }

    @Transactional(readOnly = true)
    public CustomResponse<List<Aspect>> findAllByUserNotNullAndStatusTrue() {
        return new CustomResponse<>(
                this.aspectRepository.findAllByUserNotNullAndStatusTrue(),
                false,
                200,
                "OK"
        );
    }

    @Transactional(readOnly = true)
    public CustomResponse<Aspect> findOne(long id) {
        boolean exists = this.aspectRepository.existsById(id);
        if (exists) {
            return new CustomResponse<>(
                    this.aspectRepository.findById(id).get(),
                    false,
                    200,
                    "OK"
            );
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    404,
                    "Aspect not found"
            );
        }
    }

    @Transactional(readOnly = true)
    public CustomResponse<Aspect> findByUser(long id) {
        boolean exists = this.userRepository.existsById(id);
        if (exists) {
            User user = this.userRepository.findById(id).get();
            return new CustomResponse<>(
                    this.aspectRepository.findByUser(user),
                    false,
                    200,
                    "OK"
            );
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    404,
                    "Aspect not found"
            );
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public CustomResponse<Aspect> save(Aspect aspect) {
        if (this.aspectRepository.existsByName(aspect.getName())) {
            return new CustomResponse<>(
                    null,
                    true,
                    400,
                    "Aspect already exists"
            );
        } else {
            if (userRepository.existsByEmail(aspect.getUser().getEmail())) {
                User user = userRepository.findByEmail(aspect.getUser().getEmail());
                if (user.getRole().getName().equals("Encargado")) {
                    if (user.getStatus()) {
                        user.setStatus(false);
                        aspect.setUser(user);
                        aspect.setStatus(true);
                        return new CustomResponse<>(
                                this.aspectRepository.saveAndFlush(aspect),
                                false,
                                200,
                                "Aspect saved successfully"
                        );
                    } else {
                        return new CustomResponse<>(
                                null,
                                true,
                                400,
                                "User occupied"
                        );
                    }
                } else {
                    return new CustomResponse<>(
                            null,
                            true,
                            400,
                            "User not allowed"
                    );
                }
            } else {
                return new CustomResponse<>(
                        null,
                        true,
                        404,
                        "User not found"
                );
            }
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public CustomResponse<Aspect> update(long id, Aspect aspect) {
        boolean exists = this.aspectRepository.existsById(id);
        if (exists) {
            aspect.setId(id);
            Optional<Aspect> _aspect = aspectRepository.findById(id);
            if (_aspect.get().getUser() != null) {
                if (userRepository.existsByEmail(aspect.getUser().getEmail())) {
                    User user = userRepository.findByEmail(aspect.getUser().getEmail());
                    if (_aspect.get().getUser() != user) {
                        if (user.getRole().getName().equals("Encargado")) {
                            if (user.getStatus()) {
                                _aspect.get().getUser().setStatus(true);
                                user.setStatus(false);
                                aspect.setUser(user);
                                aspect.setStatus(_aspect.get().getStatus());
                                return new CustomResponse<>(
                                        this.aspectRepository.saveAndFlush(aspect),
                                        false,
                                        200,
                                        "Aspect updated successfully"
                                );
                            } else {
                                return new CustomResponse<>(
                                        null,
                                        true,
                                        400,
                                        "User occupied"
                                );
                            }
                        } else {
                            return new CustomResponse<>(
                                    null,
                                    true,
                                    400,
                                    "User not allowed"
                            );
                        }
                    } else {
                        aspect.setUser(user);
                        aspect.setStatus(_aspect.get().getStatus());
                        return new CustomResponse<>(
                                this.aspectRepository.saveAndFlush(aspect),
                                false,
                                200,
                                "Aspect updated successfully"
                        );
                    }
                } else {
                    return new CustomResponse<>(
                            null,
                            true,
                            404,
                            "User not found"
                    );
                }
            } else {
                if (aspect.getUser() != null) {
                    if (userRepository.existsByEmail(aspect.getUser().getEmail())) {
                        User user = userRepository.findByEmail(aspect.getUser().getEmail());
                        if (user.getRole().getName().equals("Encargado")) {
                            if (user.getStatus()) {
                                user.setStatus(false);
                                aspect.setUser(user);
                                aspect.setStatus(_aspect.get().getStatus());
                                return new CustomResponse<>(
                                        this.aspectRepository.saveAndFlush(aspect),
                                        false,
                                        200,
                                        "Aspect updated successfully"
                                );
                            } else {
                                return new CustomResponse<>(
                                        null,
                                        true,
                                        400,
                                        "User occupied"
                                );
                            }
                        } else {
                            return new CustomResponse<>(
                                    null,
                                    true,
                                    400,
                                    "User not allowed"
                            );
                        }
                    } else {
                        return new CustomResponse<>(
                                null,
                                true,
                                404,
                                "User not found"
                        );
                    }
                } else {
                    aspect.setUser(null);
                    aspect.setStatus(_aspect.get().getStatus());
                    return new CustomResponse<>(
                            this.aspectRepository.saveAndFlush(aspect),
                            false,
                            200,
                            "Aspect updated successfully"
                    );
                }
            }
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    404,
                    "Aspect not found"
            );
        }
    }

    @Transactional(rollbackFor = {SQLException.class})
    public CustomResponse<Aspect> updateStatus(long id, boolean status) {
        boolean exists = this.aspectRepository.existsById(id);
        if (exists) {
            Aspect aspect = this.aspectRepository.findById(id).get();
            if (status) {
                aspect.setStatus(true);
            } else {
                if (aspect.getUser() != null) {
                    aspect.getUser().setStatus(true);
                    aspect.setUser(null);
                    aspect.setStatus(false);
                } else {
                    aspect.setStatus(false);
                }
            }
            return new CustomResponse<>(
                    this.aspectRepository.save(aspect),
                    false,
                    200,
                    "Aspect's status updated successfully"
            );
        } else {
            return new CustomResponse<>(
                    null,
                    true,
                    404,
                    "Aspect not found"
            );
        }
    }
}
