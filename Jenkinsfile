pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:${env.PATH}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "🔄 Checking out source code from Git..."
                checkout scm
                echo "✅ Checkout complete."
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🛠️ Building backend Docker image..."
                sh 'docker build -t omersemih/todo-backend:1.0.0 ./TodoApiBackend'
                echo "🛠️ Building frontend Docker image..."
                sh 'docker build -t omersemih/todo-frontend:1.0.0 ./TodoApiFrontend'
                echo "✅ Docker images built successfully."
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    echo "🔑 Logging into Docker Hub..."
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        echo "🚀 Pushing backend image..."
                        sh 'docker push omersemih/todo-backend:1.0.0'
                        echo "🚀 Pushing frontend image..."
                        sh 'docker push omersemih/todo-frontend:1.0.0'
                        echo "✅ Images pushed successfully."
                    }
                }
            }
        }

        // Stage 5: Deploy → Kubernetes, daha sonra ekleyebiliriz
    }
}