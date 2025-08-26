pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:${env.PATH}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                // Backend test
                sh 'cd TodoApiBackend && dotnet build && dotnet test'

                // Frontend test / build (opsiyonel)
                sh 'cd TodoApiFrontend && npm install && npm run build'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t omersemih/todo-backend:1.0.0 ./TodoApiBackend'
                sh 'docker build -t omersemih/todo-frontend:1.0.0 ./TodoApiFrontend'
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh 'docker push omersemih/todo-backend:1.0.0'
                        sh 'docker push omersemih/todo-frontend:1.0.0'
                    }
                }
            }
        }

        // Stage 5: Deploy → Kubernetes, daha sonra ekleyebiliriz
    }
}