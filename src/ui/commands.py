"""Command parsing and dispatch using argparse"""
import argparse
from typing import Callable, Dict, List, Tuple, Optional


def create_parser() -> argparse.ArgumentParser:
    """Create and configure argument parser for CLI commands.

    Returns:
        Configured ArgumentParser instance
    """
    parser = argparse.ArgumentParser(
        description="H2 Todo - Console Todo Manager",
        add_help=False  # We have our own help command
    )

    subparsers = parser.add_subparsers(dest="command", required=True, metavar="COMMAND")

    # Add command
    add_parser = subparsers.add_parser("add", help="Create a new task")
    add_parser.add_argument("description", help="Task description text")

    # List command
    subparsers.add_parser("list", help="Display all tasks")

    # Done command
    done_parser = subparsers.add_parser("done", help="Mark task as completed")
    done_parser.add_argument("id", type=int, help="Task ID")

    # Update command
    update_parser = subparsers.add_parser("update", help="Update task description")
    update_parser.add_argument("id", type=int, help="Task ID")
    update_parser.add_argument("description", help="New description text")

    # Delete command
    delete_parser = subparsers.add_parser("delete", help="Delete a task")
    delete_parser.add_argument("id", type=int, help="Task ID")

    # Help command
    subparsers.add_parser("help", help="Show this help message")

    # Exit command
    subparsers.add_parser("exit", help="Exit application")

    return parser


def parse_command(line: str) -> Optional[str]:
    """Parse command line and return command name.

    Args:
        line: Raw command line input from user

    Returns:
        Command name or None if parsing fails
    """
    if not line or not line.strip():
        return None

    parts = line.strip().split()
    return parts[0] if parts else None
