package utez.edu.mx.sira.aspect.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utez.edu.mx.sira.user.model.User;

import java.util.List;

@Repository
public interface AspectRepository extends JpaRepository<Aspect, Long> {
    boolean existsByName(String name);
    Aspect findByName(String name);
    Aspect findByUser(User user);
    List<Aspect> findAllByUserNotNullAndStatusTrue();
}
