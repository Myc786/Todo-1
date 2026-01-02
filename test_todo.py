#!/usr/bin/env python
"""Test main.py with all commands"""
import sys
import io
from contextlib import redirect_stdout

def test_main_basic():
    """Test basic main.py execution."""
    print("Testing main.py basic execution...")

    try:
        from src.main import main
        print("[OK] main module imports successfully")
    except Exception as e:
        print(f"[ERROR] Error importing main: {e}")
        return False

    return True


def test_domain_layer():
    """Test domain layer components."""
    print("\nTesting domain layer...")

    try:
        from src.domain.task import Task, validate_description, find_by_id
        from src.domain.exceptions import TodoError, TaskNotFoundError, InvalidDescriptionError
        print("[OK] Domain components imported successfully")
    except Exception as e:
        print(f"[ERROR] Error importing domain layer: {e}")
        return False

    # Test task creation
    task = Task(id=1, description="Test task", completed=False)
    print(f"[OK] Task created: {task}")

    # Test validation
    try:
        validate_description("")  # Should raise
        print("[ERROR] Validation failed - should have raised error")
        return False
    except InvalidDescriptionError:
        print("[OK] Validation rejects empty descriptions")

    return True


def test_service_layer():
    """Test service layer."""
    print("\nTesting service layer...")

    try:
        from src.services.todo_service import TodoService
        print("[OK] Service layer imported successfully")
    except Exception as e:
        print(f"[ERROR] Error importing service: {e}")
        return False

    service = TodoService()

    # Test add
    task = service.add("Test task")
    print(f"[OK] Task added: ID {task.id}, '{task.description}'")

    # Test list
    tasks = service.get_all()
    print(f"[OK] Listed {len(tasks)} task(s)")

    # Test done
    service.mark_done(1)
    updated_task = service.get_all()[0]
    assert updated_task.completed == True
    print("[OK] Task marked as completed")

    # Test update
    service.update(1, "Updated task")
    updated_task = service.get_all()[0]
    assert updated_task.description == "Updated task"
    print("[OK] Task updated")

    # Test delete
    service.delete(1)
    tasks = service.get_all()
    assert len(tasks) == 0
    print("[OK] Task deleted")

    return True


def test_ui_layer():
    """Test UI layer imports."""
    print("\nTesting UI layer...")

    try:
        from src.ui.console import display_welcome, display_help, display_tasks
        from src.ui.commands import create_parser
        print("[OK] UI components imported successfully")
    except Exception as e:
        print(f"[ERROR] Error importing UI layer: {e}")
        return False

    # Test parser creation
    parser = create_parser()
    print(f"[OK] Parser created: {type(parser).__name__}")

    # Test display functions
    output = io.StringIO()
    with redirect_stdout(output):
        display_help()

    help_text = output.getvalue()
    assert "Commands:" in help_text
    print("[OK] Help display works")

    return True


if __name__ == "__main__":
    all_passed = True

    all_passed &= test_main_basic()
    all_passed &= test_domain_layer()
    all_passed &= test_service_layer()
    all_passed &= test_ui_layer()

    if all_passed:
        print("\n" + "=" * 50)
        print("[OK] ALL TESTS PASSED!")
        print("=" * 50)
        print("\nThe console app is ready to use.")
        print("Run: python -m src.main")
    else:
        print("\n" + "=" * 50)
        print("[ERROR] SOME TESTS FAILED")
        print("=" * 50)
        sys.exit(1)
