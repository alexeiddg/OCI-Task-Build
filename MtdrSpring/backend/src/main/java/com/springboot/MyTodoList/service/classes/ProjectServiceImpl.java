package com.springboot.MyTodoList.service.classes;

import com.springboot.MyTodoList.model.AppUser;
import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.repository.AppUserRepository;
import com.springboot.MyTodoList.repository.ProjectRepository;
import com.springboot.MyTodoList.service.interfaces.ProjectService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final AppUserRepository appUserRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository, AppUserRepository appUserRepository) {
        this.projectRepository = projectRepository;
        this.appUserRepository = appUserRepository;
    }

    @Override
    public Optional<Project> getProjectById(Long projectId) {
        return projectRepository.findById(projectId);
    }

    @Override
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public List<Project> findByUser(AppUser user) {
        return projectRepository.findByUser(user);
    }

    @Override
    public List<Project> getProjectsManagedByUser(Long managerId) {
        Optional<AppUser> manager = appUserRepository.findById(managerId);
        if (manager.isPresent()) {
            return projectRepository.findByManager(manager.get());
        }
        throw new RuntimeException("Manager not found.");
    }

    @Override
    public Project assignManagerToProject(Long projectId, Long managerId) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        Optional<AppUser> managerOpt = appUserRepository.findById(managerId);

        if (projectOpt.isPresent() && managerOpt.isPresent()) {
            Project project = projectOpt.get();
            AppUser manager = managerOpt.get();

            if (!manager.getRole().equals("MANAGER")) {
                throw new RuntimeException("User is not a manager.");
            }

            if (project.getManager() != null) {
                throw new RuntimeException("This project already has a manager.");
            }

            project.setManager(manager);
            return projectRepository.save(project);
        }
        throw new RuntimeException("Project or Manager not found.");
    }
}
