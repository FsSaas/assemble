wrap([ $class: 'TimestamperBuildWrapper' ]) {

  stage ('define var') {
    pckJson = readJSON file: './package.json'
    safeCmpName = pckJson.name.replace("@","").replace("/", "-")
    shortCommit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
  }

  stage ('npm install') {
    sh 'npm cache verify'
    sh 'npm install'
  }

  stage ('clean') {
    sh 'rm -rf es lib dist storybook-static'
  }

  parallel (
    'npm run build:*': {
      stage ('npm run build:*') {
        sh "npm run build:es"
        sh "npm run build:lib"
        sh "npm run build:umd"
      }
    },
    'build stroybook': {
      stage ('build stroybook') {
        sh 'npm run build-storybook'
      }
    }
  )

  parallel (
    'oss storybook': {
      stage ('oss storybook') {
        sh '/home/jenkins-slave/ossutil64 cp -r -u ./storybook-static oss://onepaas/ux/storybook/ --config-file /home/jenkins-slave/.ossutilconfig'
      }
    },
    'oss dist': {
      stage ('oss dist') {
        sh '/home/jenkins-slave/ossutil64 cp -r -u ./dist oss://onepaas/ux/runtime/ --config-file /home/jenkins-slave/.ossutilconfig'
      }
    },
    'npm publish': {
      stage ('npm publish') {
        sh "npm publish --access public"
      }
    }
  )
}
