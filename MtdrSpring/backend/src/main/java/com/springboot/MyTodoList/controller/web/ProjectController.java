package com.springboot.MyTodoList.controller.web;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.service.interfaces.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/project")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // Get all projects
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    // Get a project by ID
    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long projectId) {
        Optional<Project> project = projectService.getProjectById(projectId);
        return project.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new project
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectService.saveProject(project));
    }

    // Delete a project by ID
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }

    // Get projects managed by a specific user
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<List<Project>> getProjectsManagedByUser(@PathVariable Long managerId) {
        return ResponseEntity.ok(projectService.getProjectsManagedByUser(managerId));
    }

    // Assign a manager to a project
    @PutMapping("/{projectId}/assign-manager/{managerId}")
    public ResponseEntity<Project> assignManagerToProject(
            @PathVariable Long projectId,
            @PathVariable Long managerId) {
        return ResponseEntity.ok(projectService.assignManagerToProject(projectId, managerId));
    }
}
