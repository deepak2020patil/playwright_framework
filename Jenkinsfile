pipeline {
  agent any

  environment {
    CI = 'true'
    HUB_URL = ''
  }

  stages {
    stage('Install Dependencies') {
      steps {
        bat 'npm install'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        bat 'npx playwright test --project=chromium --project=firefox --project=webkit'
      }
    }

    stage('Publish Report') {
      steps {
        publishHTML(target: [
          allowMissing: true,
          alwaysLinkToLastBuild: true,
          keepAll: true,
          reportDir: 'playwright-report',
          reportFiles: 'index.html',
          reportName: 'Playwright Report'
        ])
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
    }
  }
}
