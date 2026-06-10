import type { Task, Goal, UserSettings } from '../types';

export class StorageService {
  static saveTasks(tasks: Task[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  static getTasks(): Task[] {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }

  static saveGoals(goals: Goal): void {
    localStorage.setItem('goals', JSON.stringify(goals));
  }

  static getGoals(): Goal {
    const goals = localStorage.getItem('goals');
    return goals ? JSON.parse(goals) : { daily: 5, weekly: 25, monthly: 100 };
  }

  static saveSettings(settings: UserSettings): void {
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  static getSettings(): UserSettings {
    const settings = localStorage.getItem('settings');
    return settings ? JSON.parse(settings) : { theme: 'dark', notifications: true, defaultView: 'list' };
  }
}