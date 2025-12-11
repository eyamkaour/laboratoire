pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'master', url: 'https://github.com/eyamkaour/laboratoire.git'
            }
        }

        stage('Verify Files') {
            steps {
                echo "Check if db.json exists..."
                bat 'dir db.json || echo "WARNING: db.json not found!"'
                
                echo "Check if nginx.conf exists..."
                bat 'dir nginx.conf || echo "WARNING: nginx.conf not found!"'
            }
        }

        stage('Docker Compose Build & Up') {
            steps {
                echo "Stop old containers..."
                bat 'docker-compose down -v || exit 0'

                echo "Build and start containers..."
                bat 'docker-compose up -d --build'
                
            }
        }

        stage('Test Services') {
            steps {
                echo "Check Angular logs..."
                bat 'docker logs testproj-angular-app-1 || echo "Angular container not found"'
                
                echo "Check JSON Server logs..."
                bat 'docker logs testproj-json-server-1 || echo "JSON Server container not found"'
                
                echo "List running containers..."
                bat 'docker ps'
            }
        }
        
        stage('Health Check') {
            steps {
                echo "Testing JSON Server..."
                bat 'curl http://localhost:3000 || echo "JSON Server not responding"'
                
                echo "Testing Angular App..."
                bat 'curl http://localhost:4200 || echo "Angular App not responding"'
            }
        }
    }
}