"""Main application bootstrap and entry point"""
from .ui.console import display_welcome, run_interactive
from .services.todo_service import TodoService


def main() -> None:
    """Main entry point for H2 Todo console application."""
    service = TodoService()
    display_welcome()
    run_interactive(service)


if __name__ == "__main__":
    main()
