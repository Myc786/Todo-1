"""Console I/O handler with display functions and input loop"""
import sys
from typing import List, Optional
from ..domain.task import Task
from ..domain.exceptions import TodoError, TaskNotFoundError, InvalidDescriptionError


def display_welcome() -> None:
    """Display welcome message."""
    print("\n=== Todo Application ===")
    print("1. View tasks")
    print("2. Add task")
    print("3. Update task")
    print("4. Delete task")
    print("5. Toggle complete")
    print("6. Exit")


def display_help() -> None:
    """Display command help message."""
    print("""
H2 Todo - Console Todo Manager

Commands:
  add <description>     Create a new task
  list                  Display all tasks
  done <id>             Mark task as completed
  update <id> <desc>    Update task description
  delete <id>           Delete a task
  help                  Show this help message
  exit                  Exit application

Examples:
  add Buy groceries
  list
  done 1
  update 1 "Buy almond milk"
  delete 2
    """)


def display_add_success(task: Task) -> None:
    """Display task addition success message."""
    print(f"[OK] Task {task.id} added: {task.description}")


def display_mark_done_success(task: Task, is_idempotent: bool = False) -> None:
    """Display task completion success message."""
    if is_idempotent:
        print(f"[OK] Task {task.id} is already completed")
    else:
        print(f"[OK] Task {task.id} marked as completed")


def display_update_success(task: Task) -> None:
    """Display task update success message."""
    print(f"[OK] Task {task.id} updated: {task.description}")


def display_delete_success(task_id: int) -> None:
    """Display task deletion success message."""
    print(f"[OK] Task {task_id} deleted")


def display_tasks(tasks: List[Task]) -> None:
    """Display all tasks with status indicators.

    Args:
        tasks: List of tasks to display
    """
    if not tasks:
        display_tasks_empty()
        return

    print("Tasks:")
    completed_count = 0

    for task in tasks:
        status = "X" if task.completed else " "
        print(f"  {task.id}. [{status}] {task.description}")
        if task.completed:
            completed_count += 1

    print(f"\n{len(tasks)} tasks ({completed_count} completed)")


def display_tasks_empty() -> None:
    """Display empty task list message."""
    print("No tasks found")


def display_error(error: TodoError) -> None:
    """Display domain error message.

    Args:
        error: Domain exception to display
    """
    print(f"[ERROR] {error}")


def display_unknown_command(command: str) -> None:
    """Display unknown command error message."""
    print(f"[ERROR] Unknown command '{command}'. Type 'help' for available commands.")


def display_exit() -> None:
    """Display exit message."""
    print("Goodbye!")


def run_interactive(service) -> None:
    """Run interactive console loop.

    Args:
        service: TodoService instance for business operations
    """
    while True:
        try:
            # Display prompt
            choice = input("\nChoose option (1-6): ").strip()

            # Handle empty input
            if not choice:
                continue

            # Parse choice
            if choice == "1":
                # View tasks
                tasks = service.get_all()
                display_tasks(tasks)

            elif choice == "2":
                # Add task
                description = input("Enter task description: ").strip()
                if description:
                    task = service.add(description)
                    display_add_success(task)
                else:
                    print("[ERROR] Task description cannot be empty")

            elif choice == "3":
                # Update task
                task_id_str = input("Enter task ID: ").strip()
                if task_id_str.isdigit():
                    task_id = int(task_id_str)
                    description = input("Enter new description: ").strip()
                    if description:
                        task = service.update(task_id, description)
                        display_update_success(task)
                    else:
                        print("[ERROR] Task description cannot be empty")
                else:
                    print("[ERROR] Invalid task ID")

            elif choice == "4":
                # Delete task
                task_id_str = input("Enter task ID: ").strip()
                if task_id_str.isdigit():
                    task_id = int(task_id_str)
                    service.delete(task_id)
                    display_delete_success(task_id)
                else:
                    print("[ERROR] Invalid task ID")

            elif choice == "5":
                # Toggle complete
                task_id_str = input("Enter task ID: ").strip()
                if task_id_str.isdigit():
                    task_id = int(task_id_str)
                    task = service.mark_done(task_id)
                    is_idempotent = task.completed  # Check if it was already completed
                    display_mark_done_success(task, is_idempotent)
                else:
                    print("[ERROR] Invalid task ID")

            elif choice == "6":
                # Exit
                display_exit()
                break

            else:
                print(f"[ERROR] Invalid option '{choice}'. Please choose 1-6.")

        except (TaskNotFoundError, InvalidDescriptionError) as e:
            display_error(e)
        except KeyboardInterrupt:
            print("\n\nExiting...")
            break
        except EOFError:
            print("\n\nExiting...")
            break
        except Exception as e:
            print(f"✗ Error: Unexpected error - {e}")
