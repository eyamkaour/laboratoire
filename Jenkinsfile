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
                script {
                    bat 'if exist db.json (echo db.json found) else (echo WARNING: db.json not found!)'
                    bat 'if exist nginx.conf (echo nginx.conf found) else (echo WARNING: nginx.conf not found!)'
                    bat 'if exist Dockerfile (echo Dockerfile found) else (echo ERROR: Dockerfile not found! && exit 1)'
                    bat 'if exist package.json (echo package.json found) else (echo ERROR: package.json not found! && exit 1)'
                    bat 'if exist jmeter-tests\\api-test.jmx (echo JMeter test found) else (echo WARNING: JMeter test not found!)'
                }
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                echo "=== Stopping and removing old containers ==="
                script {
                    bat 'docker-compose down -v --remove-orphans || exit /b 0'
                    bat 'docker rm -f nginx-app json-server angular-app 2>nul || exit /b 0'
                }
                sleep(time: 5, unit: 'SECONDS')
            }
        }

        stage('Build & Start Services') {
            steps {
                echo "=== Building and starting containers ==="
                bat 'docker-compose up -d --build'
                sleep(time: 30, unit: 'SECONDS')
            }
        }

        stage('Performance Tests') {
            parallel {
                stage('JMeter - API Load Test') {
                    steps {
                        echo "=== Running JMeter Performance Tests ==="
                        script {
                            // Supprime l'ancien dossier de résultats si existant
                            bat 'if exist jmeter-results rmdir /s /q jmeter-results'
                            bat 'mkdir jmeter-results'
                            bat 'docker-compose --profile test run --rm jmeter'
                        }
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'jmeter-results/html-report',
                            reportFiles: 'index.html',
                            reportName: 'JMeter Performance Report',
                            reportTitles: 'API Load Test Results'
                        ])
                    }
                }

                stage('Lighthouse - Frontend Performance') {
                    steps {
                        echo "=== Running Lighthouse Audit ==="
                        script {
                            // Supprime l'ancien dossier de rapports si existant
                            bat 'if exist lighthouse-reports rmdir /s /q lighthouse-reports'
                            bat 'mkdir lighthouse-reports'
                            bat 'docker-compose --profile test run --rm lighthouse lighthouse http://angular-app:80 --chrome-flags="--headless --no-sandbox --disable-gpu" --output=html --output=json --output-path=/home/chrome/reports/report.html'
                        }
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'lighthouse-reports',
                            reportFiles: 'report.html',
                            reportName: 'Lighthouse Performance Report',
                            reportTitles: 'Frontend Performance Audit'
                        ])
                    }
                }
            }
        }
    }

    post {
        always {
            echo "=== Pipeline completed ==="
            bat 'docker ps || exit /b 0'
            echo "=== Cleaning up test containers ==="
            bat 'docker-compose --profile test down || exit /b 0'
        }
        failure {
            echo "❌ PIPELINE ÉCHOUÉ ❌"
            script {
                bat 'docker logs angular-app 2>nul || echo No Angular logs'
                bat 'docker logs json-server 2>nul || echo No JSON Server logs'
                bat 'docker ps -a || exit /b 0'
            }
        }
        success {
            echo "=========================================="
            echo "        ✅ PIPELINE RÉUSSI ! ✅          "
            echo "=========================================="
            echo ""
            echo "🌐 Application: http://localhost:4200"
            echo "📡 JSON Server: http://localhost:3000"
            echo "🔗 API Proxy: http://localhost:4200/api/events"
            echo ""
            echo "📊 Rapports de performance:"
            echo "  - JMeter: Jenkins > JMeter Performance Report"
            echo "  - Lighthouse: Jenkins > Lighthouse Performance Report"
            echo ""
            echo "✨ Tous les tests ont réussi !"
        }
    }
}
