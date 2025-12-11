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
                echo "=== Checking required files ==="
                bat 'if exist db.json (echo db.json found) else (echo WARNING: db.json not found!)'
                bat 'if exist nginx.conf (echo nginx.conf found) else (echo WARNING: nginx.conf not found!)'
                bat 'if exist Dockerfile (echo Dockerfile found) else (echo ERROR: Dockerfile not found! && exit 1)'
                bat 'if exist package.json (echo package.json found) else (echo ERROR: package.json not found! && exit 1)'
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                echo "=== Stopping and removing old containers ==="
                bat 'docker-compose down -v || exit 0'
               
            }
        }

        stage('Build & Start Services') {
            steps {
                echo "=== Building and starting containers ==="
                bat 'docker-compose up -d --build'
                
                echo "=== Waiting for services to be healthy ==="
               
            }
        }

        stage('Debug Containers') {
            steps {
                echo "=== List running containers ==="
                bat 'docker ps'
                
                echo "=== Check Angular container logs ==="
                bat 'docker logs angular-app || docker logs testproj-angular-app-1'
                
                echo "=== Check JSON Server logs ==="
                bat 'docker logs json-server || docker logs testproj-json-server-1'
                
                echo "=== Check files in Angular container ==="
                bat 'docker exec angular-app ls -la /usr/share/nginx/html || exit 0'
                
                echo "=== Check Nginx config in container ==="
                bat 'docker exec angular-app cat /etc/nginx/conf.d/default.conf || exit 0'
                
                echo "=== Test from inside Angular container ==="
                bat 'docker exec angular-app wget -O- http://localhost:80/health || exit 0'
            }
        }

        stage('Health Checks') {
            steps {
                script {
                    // Retry logic pour attendre que les services soient prêts
                    retry(5) {
                        sleep(time: 5, unit: 'SECONDS')
                        
                        echo "=== Testing Angular health endpoint ==="
                        bat 'curl -f http://localhost:4200/health || exit 1'
                    }
                }
                
                echo "=== Testing Angular main page ==="
                bat 'curl -f http://localhost:4200 || exit 1'
                
                echo "=== Testing JSON Server ==="
                bat 'curl -f http://localhost:3000/ || exit 1'
                
                echo "=== Testing API proxy ==="
                bat 'curl -f http://localhost:4200/api/events || exit 1'
            }
        }

        stage('Verify Response Content') {
            steps {
                echo "=== Checking if Angular returns HTML ==="
                bat 'curl http://localhost:4200 > response.html'
                bat 'type response.html'
                bat 'findstr /C:"<!doctype html>" response.html || findstr /C:"<html" response.html || exit 1'
            }
        }
    }

    post {
        always {
            echo "=== Pipeline completed ==="
            bat 'docker ps'
        }
        failure {
            echo "=== Pipeline FAILED - Collecting debug info ==="
            bat 'docker logs angular-app || exit 0'
            bat 'docker logs json-server || exit 0'
            bat 'docker-compose logs || exit 0'
        }
        success {
            echo "=== Pipeline SUCCESS ==="
            echo "Application available at: http://localhost:4200"
            echo "JSON Server available at: http://localhost:3000"
            echo "API available at: http://localhost:4200/api/events"
        }
    }
}