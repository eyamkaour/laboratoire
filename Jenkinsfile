pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url:'https://github.com/eyamkaour/laboratoire.git'
            }
        }
        stage('Build') {
            steps {
                echo "Build du projet..."
            }
        }
        stage('Test') {
            steps {
                echo "Tests unitaires..."
            }
        }
        stage('Deploy') {
            steps {
                echo "Déploiement..."
            }
        }
    }
}
