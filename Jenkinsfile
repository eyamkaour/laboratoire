pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'master', url: 'https://github.com/eyamkaour/laboratoire.git'
            }
        }

        stage('Docker Compose Build & Up') {
            steps {
                echo "Stop old containers..."
                bat 'docker-compose down || exit 0'

                echo "Build and start containers..."
                bat 'docker-compose up -d --build'
            }
        }

        stage('Test Angular') {
            steps {
                echo "Check Angular logs..."
                bat 'docker logs angular-app'
            }
        }
    }
}

