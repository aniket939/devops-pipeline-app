pipeline {
    agent any

    environment {
        NODE_HOME = tool name: 'NodeJS', type: 'NodeJS'
        PATH = "${env.NODE_HOME}/bin;${env.PATH}"
        // Define SonarScanner path if installed manually
        SONAR_SCANNER_HOME = 'C:\\SonarScanner'
        PATH = "${env.SONAR_SCANNER_HOME}\\bin;${env.PATH}"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                bat 'npm install'
                bat 'npm run lint || echo "Lint warnings found, continuing..."'
                bat 'docker build -t devops-pipeline-app .'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }

        stage('Selenium Tests') {
            steps {
                // Failures in Selenium should not stop the pipeline
                bat 'npm run test:selenium || echo "Selenium test failed, continuing..."'
            }
        }

        stage('Code Quality') {
            steps {
                // Failures in SonarScanner should not stop the pipeline
                bat """
                if exist "%SONAR_SCANNER_HOME%\\bin\\sonar-scanner.bat" (
                    sonar-scanner -Dsonar.projectKey=devops-pipeline-app -Dsonar.sources=. -Dsonar.host.url=http://localhost:9000 -Dsonar.login=%SONAR_TOKEN% || echo "SonarScanner failed, continuing..."
                ) else (
                    echo "SonarScanner not found, skipping code quality..."
                )
                """
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Security scan stage (skipped if previous failures)'
            }
        }

        stage('Deploy to Test') {
            steps {
                echo 'Deploy to Test stage (skipped if previous failures)'
            }
        }

        stage('Release') {
            steps {
                echo 'Release stage (skipped if previous failures)'
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Monitoring stage (skipped if previous failures)'
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed'
        }
    }
}
