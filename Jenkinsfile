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
        script {
          // Find the latest test-results folder
          def latestReport = bat(script: '@powershell -NoProfile -Command "Get-ChildItem test-results -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName"', returnStdout: true).trim()
          if (latestReport) {
            publishHTML(target: [
              allowMissing: true,
              alwaysLinkToLastBuild: true,
              keepAll: true,
              reportDir: "${latestReport}\\report",
              reportFiles: 'index.html',
              reportName: 'Playwright Report'
            ])
          }
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
    }
  }
}
