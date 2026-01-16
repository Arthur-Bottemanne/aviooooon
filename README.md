# Aviooooon

## 1. Project Overview

This project aims to provide an assistance tool for photographers who wish to capture an airplane passing in front of the moon. By combining real-time aircraft data with astronomical calculations, the application predicts "lunar transits" and alerts the user.

## 2. Setup & Execution

### Prerequisites

- Python 3.10+
- A modern web browser
- Internet access for OpenSky API data 

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Arthur-Bottemanne/aviooooon.git
cd aviooooon
```


2. **Setup the API:**
```bash
cd api
pip install -r ./requirements.txt
uvicorn main:app --reload
```

3. **Launch the Interface:**
Simply open `interface/index.html` in your browser. Ensure the API is running to see live plane data.

## 3. File Architecture

The project is split into a python FastAPI backend and a vanilla HTML/JS frontend.

```text
.
├── api/                # Python FastAPI Backend
├── interface/          # Frontend Web Interface
└── README.md

```

## 4. Technical Conventions & Norms

To ensure the project is maintainable, we follow these standards:

### Coding Standards

- [PEP8](https://peps.python.org/pep-0008/)
- [ES6](https://262.ecma-international.org/6.0/)

### Git & Documentation

- [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Conventional branch](https://conventional-branch.github.io/)

## 5. Collaboration Workflow

We use GitHub issues and pull requests to manage our tasks and code quality.

1. **Issues:** Tasks to be done containing user stories and scenarios to validate the issue.
2. **Branches:** Never work directly on `main` or `develop`. Create a feature branch from an issue.
3. **Pull Requests:** Once a sub-issue is complete, open a PR and add a reviewer. It will then be reviewed and if it passes the standards, it will be merged to `develop`


**Documentation API:**

Use this link for the documentation of the API:
http://127.0.0.1:8000/docs
