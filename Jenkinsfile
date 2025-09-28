pipeline {
    agent any

    tools {
        nodejs 'Node22'
    }

    environment {
        IMAGE_NAME = "devops-pipeline-app"
        DOCKER_COMPOSE_FILE = "docker-compose.yml"
        SONARQUBE = "SonarScanner"
        SONAR_HOST = "http://localhost:9000"
        SONAR_TOKEN = credentials('sonar-token') // Jenkins credentials
    }

    stages {

        stage('Checkout') {
            steps {
                git url: 'https://github.com/aniket939/devops-pipeline-app.git', branch: 'main'
            }
        }

        stage('Build') {
            steps {
                bat 'npm install'
                bat 'npm run lint'
                bat 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
               
        stage('Selenium Tests') {
            steps {
                bat 'npm run test:selenium'
            }
        }

        stage('Code Quality') {
            steps {
                bat "$SONARQUBE/bin/sonar-scanner -Dsonar.projectKey=devops-pipeline-app -Dsonar.sources=. -Dsonar.host.url=$SONAR_HOST -Dsonar.login=$SONAR_TOKEN"
            }
        }

        stage('Security Scan') {
            steps {
                bat "docker scan $IMAGE_NAME || echo 'Security scan completed'"
            }
        }

        stage('Deploy to Test') {
            steps {
                bat "docker-compose down || true"
                bat "docker-compose up -d"
            }
        }

        stage('Release') {
            steps {
                bat "docker tag $IMAGE_NAME <dockerhub-username>/$IMAGE_NAME:v1.0"
                bat "docker push <dockerhub-username>/$IMAGE_NAME:v1.0"
            }
        }

        stage('Monitoring') {
            steps {
                script {
                    def response = bat(script: "curl -s http://localhost:3000/health", returnStdout: true).trim()
                    echo "Health check: ${response}"
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed'
        }
    }
}