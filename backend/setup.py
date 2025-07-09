#!/usr/bin/env python3
import os
import sys
import subprocess

def run_command(command):
    """Run a command and return its output"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Error: {e.stderr}")
        sys.exit(1)

def main():
    print("Setting up Django E-book Platform...")
    
    # Install dependencies
    print("Installing dependencies...")
    run_command("pip install -r requirements.txt")
    
    # Run migrations
    print("Running migrations...")
    run_command("python manage.py makemigrations")
    run_command("python manage.py migrate")
    
    # Create superuser
    print("Creating superuser...")
    print("Please create an admin user:")
    run_command("python manage.py createsuperuser")
    
    # Collect static files
    print("Collecting static files...")
    run_command("python manage.py collectstatic --noinput")
    
    print("\nSetup complete!")
    print("To start the development server, run:")
    print("python manage.py runserver")

if __name__ == "__main__":
    main()