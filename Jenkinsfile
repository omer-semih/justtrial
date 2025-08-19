pipeline {
    agent any   // pipeline hangi node/agent üstünde çalışacak?
    stages {    // aşamalar
        stage('Build') {
            steps { 
                echo 'Building...' 
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
            }
        }
    }
}
