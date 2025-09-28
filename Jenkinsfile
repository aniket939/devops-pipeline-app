pipeline {
    agent any

    environment {
        IMAGE_NAME = "devops-pipeline-app"
        DOCKER_COMPOSE_FILE = "docker-compose.yml"
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
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Selenium E2E Test') {
            steps {
                sh 'npm run selenium-test'
            }
        }

        stage('Code Quality') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
                sh "trivy image ${IMAGE_NAME}"
            }
        }

        stage('Deploy to Test') {
            steps {
                sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up -d --build"
            }
        }

        stage('Release to Prod') {
            steps {
                sh "docker tag ${IMAGE_NAME} <dockerhub-username>/${IMAGE_NAME}:v1.0"
                sh "docker push <dockerhub-username>/${IMAGE_NAME}:v1.0"
            }
        }

        stage('Monitoring & Alerting') {
            steps {
                script {
                    def response = sh(script: "curl -s http://localhost:3000/health", returnStdout: true).trim()
                    echo "Health check: ${response}"
                    if (!response.contains('ok')) {
                        error("Health check failed!")
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }
    }
}
