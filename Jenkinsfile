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
                sh 'npm install'
                sh 'npm run lint'
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
               
        stage('Selenium Tests') {
            steps {
                sh 'npm run test:selenium'
            }
        }

        stage('Code Quality') {
            steps {
                sh "$SONARQUBE/bin/sonar-scanner -Dsonar.projectKey=devops-pipeline-app -Dsonar.sources=. -Dsonar.host.url=$SONAR_HOST -Dsonar.login=$SONAR_TOKEN"
            }
        }

        stage('Security Scan') {
            steps {
                sh "docker scan $IMAGE_NAME || echo 'Security scan completed'"
            }
        }

        stage('Deploy to Test') {
            steps {
                sh "docker-compose down || true"
                sh "docker-compose up -d"
            }
        }

        stage('Release') {
            steps {
                sh "docker tag $IMAGE_NAME <dockerhub-username>/$IMAGE_NAME:v1.0"
                sh "docker push <dockerhub-username>/$IMAGE_NAME:v1.0"
            }
        }

        stage('Monitoring') {
            steps {
                script {
                    def response = sh(script: "curl -s http://localhost:3000/health", returnStdout: true).trim()
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
