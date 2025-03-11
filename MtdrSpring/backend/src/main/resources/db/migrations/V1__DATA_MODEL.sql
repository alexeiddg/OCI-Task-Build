-- ================= USERS =================
CREATE TABLE app_user (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('MANAGER', 'DEVELOPER')),
    telegram_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_app_user_username ON app_user(username);

-- ================= TEAMS =================
CREATE TABLE teams (
    team_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    team_name VARCHAR(100) UNIQUE NOT NULL,
    project_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_team_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

CREATE INDEX idx_teams_project ON teams(project_id);

-- ================= PROJECTS =================
CREATE TABLE projects (
    project_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    project_desc VARCHAR(500),
    manager_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_project_manager FOREIGN KEY (manager_id) REFERENCES app_user(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_projects_manager ON projects(manager_id);

-- ================= SPRINTS =================
CREATE TABLE sprints (
    sprint_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INT NOT NULL,
    sprint_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_tasks INT DEFAULT 0,
    completed_tasks INT DEFAULT 0,
    sprint_velocity INT DEFAULT 0,
    completion_rate FLOAT DEFAULT 0.0,
    CONSTRAINT fk_sprint_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

CREATE INDEX idx_sprints_project ON sprints(project_id);

-- ================= TASKS =================
CREATE TABLE tasks (
    task_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INT NOT NULL,
    sprint_id INT,
    team_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    priority VARCHAR(20),
    status VARCHAR(20) DEFAULT 'PENDING',
    created_by INT,
    assigned_to INT,
    task_type VARCHAR(50) NOT NULL,
    story_points INT DEFAULT 1,
    cycle_time INTERVAL DAY TO SECOND,
    time_in_progress INTERVAL DAY TO SECOND,
    blocked BOOLEAN DEFAULT FALSE CHECK (blocked IN (FALSE, TRUE)),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_task_sprint FOREIGN KEY (sprint_id) REFERENCES sprints(sprint_id) ON DELETE SET NULL,
    CONSTRAINT fk_task_team FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    CONSTRAINT fk_task_creator FOREIGN KEY (created_by) REFERENCES app_user(user_id) ON DELETE SET NULL,
    CONSTRAINT fk_task_assignee FOREIGN KEY (assigned_to) REFERENCES app_user(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_sprint ON tasks(sprint_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_team ON tasks(team_id);

-- ================= TASK METRICS =================
CREATE TABLE task_metrics (
    metric_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    team_id INT NOT NULL,
    sprint_id INT,
    project_id INT,
    developer_id INT,
    total_assigned_tasks INT DEFAULT 0,
    completed_tasks INT DEFAULT 0,
    avg_completion_time INTERVAL DAY TO SECOND,
    workload_balance FLOAT,
    bugs_fixed INT DEFAULT 0,
    features_completed INT DEFAULT 0,
    sprint_completion_rate FLOAT DEFAULT 0.0,
    efficiency_score FLOAT DEFAULT 0.0,
    CONSTRAINT fk_metrics_team FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    CONSTRAINT fk_metrics_sprint FOREIGN KEY (sprint_id) REFERENCES sprints(sprint_id) ON DELETE SET NULL,
    CONSTRAINT fk_metrics_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_metrics_developer FOREIGN KEY (developer_id) REFERENCES app_user(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_metrics_team ON task_metrics(team_id);
CREATE INDEX idx_metrics_developer ON task_metrics(developer_id);

-- ================= COMMENTS =================
CREATE TABLE comments (
    comment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text VARCHAR(2000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_task FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_comments_task ON comments(task_id);

-- ================= TASK AUDIT LOG =================
CREATE TABLE task_audit (
    audit_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    task_id INT NOT NULL,
    changed_by INT NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    change_type VARCHAR(20),
    change_comment VARCHAR(2000),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_task FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
    CONSTRAINT fk_audit_user FOREIGN KEY (changed_by) REFERENCES app_user(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_audit_task ON task_audit(task_id);

-- ================= NOTIFICATIONS =================
CREATE TABLE notifications (
    notification_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    task_id INT,
    notification_type VARCHAR(50) NOT NULL,
    channel VARCHAR(20),
    message VARCHAR(2000) NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_task FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_task ON notifications(task_id);