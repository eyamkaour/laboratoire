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
                
                echo "=== Waiting for cleanup to complete ==="
                sleep(time: 5, unit: 'SECONDS')
            }
        }

        stage('Build & Start Services') {
            steps {
                echo "=== Building and starting containers ==="
                bat 'docker-compose up -d --build'
                
                echo "=== Waiting for services to start ==="
                sleep(time: 30, unit: 'SECONDS')
            }
        }

        stage('Debug Containers') {
            steps {
                echo "=== List running containers ==="
                bat 'docker ps'
                
                echo "=== Check Angular container logs ==="
                script {
                    bat 'docker logs angular-app 2>nul || docker logs testproj-angular-app-1 2>nul || echo No Angular container found'
                }
                
                echo "=== Check JSON Server logs ==="
                script {
                    bat 'docker logs json-server 2>nul || docker logs testproj-json-server-1 2>nul || echo No JSON Server container found'
                }
                
                echo "=== Check files in Angular container ==="
                script {
                    bat 'docker exec angular-app ls -la /usr/share/nginx/html 2>nul || echo Cannot access container'
                }
            }
        }

        stage('Health Checks') {
            steps {
                script {
                    echo "=== Waiting for services to be ready ==="
                    retry(5) {
                        sleep(time: 5, unit: 'SECONDS')
                        echo "Testing Angular health endpoint..."
                        bat 'curl -f http://localhost:4200/health'
                    }
                }
                
                echo "=== Testing Angular main page ==="
                bat 'curl -f http://localhost:4200'
                
                echo "=== Testing JSON Server ==="
                bat 'curl -f http://localhost:3000/'
                
                echo "=== Testing API proxy ==="
                bat 'curl -f http://localhost:4200/api/events'
            }
        }

        stage('Verify Response Content') {
            steps {
                echo "=== Checking if Angular returns HTML ==="
                bat 'curl http://localhost:4200 > response.html'
                bat 'findstr /C:"<html" response.html'
            }
        }

        stage('Performance Tests') {
            parallel {
                stage('JMeter - API Load Test') {
                    steps {
                        echo "=== Running JMeter Performance Tests ==="
                        echo "Testing API with 20 virtual users..."
                        
                        script {
                            bat 'if not exist jmeter-results mkdir jmeter-results'
                            bat 'docker-compose --profile test run --rm jmeter'
                        }
                        
                        echo "=== JMeter test completed ==="
                        
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
                        echo "Analyzing Angular app performance..."
                        
                        script {
                            bat 'if not exist lighthouse-reports mkdir lighthouse-reports'
                            bat 'docker-compose --profile test run --rm lighthouse'
                        }
                        
                        echo "=== Lighthouse audit completed ==="
                        
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

        stage('Performance Summary') {
            steps {
                echo "=========================================="
                echo "     TESTS DE PERFORMANCE TERMINÉS       "
                echo "=========================================="
                echo ""
                echo "📊 JMeter Report: Voir dans Jenkins > JMeter Performance Report"
                echo "🔍 Lighthouse Report: Voir dans Jenkins > Lighthouse Performance Report"
                echo ""
                echo "Résultats disponibles dans:"
                echo "  - jmeter-results/html-report/index.html"
                echo "  - lighthouse-reports/report.html"
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
            echo "=========================================="
            echo "     ❌ PIPELINE ÉCHOUÉ ❌               "
            echo "=========================================="
            echo "Collecte des informations de debug..."
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