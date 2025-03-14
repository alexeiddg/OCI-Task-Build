export interface Sprint {
  sprintId: number;
  completed_tasks?: number;
  completion_rate?: number;
  end_date?: Date;
  sprint_name?: string;
  sprint_velocity?: number;
  start_date?: Date;
  total_tasks?: number;
  project_id: number;
}
