wrap([ $class: 'TimestamperBuildWrapper' ]) {

  stage ('define var') {
    pckJson = readJSON file: './package.json'
    safeCmpName = pckJson.name.replace("@","").replace("/", "-")
    shortCommit = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
  }

  stage ('recording') {
    sh "curl -H \"Content-Type:application/json\" -X PUT --data '{ \"name\": \"${pckJson.name}\", \"version\": \"${pckJson.version}\", \"ci-name\": \"http://jci.onelaas.com\", \"ci-job-name\": \"${JOB_NAME}\", \"ci-job-number\": ${BUILD_NUMBER} }' http://182.92.157.77:7001/api/v3/ci/builds"
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
    'center': {
      stage ('center') {
        sh "curl -H \"Content-Type:application/json\" -X PUT --data '{ \"assets\": \"/${safeCmpName}/release/dist/main-${pckJson.version}\.min\.js\", \"example-path\": \"/${safeCmpName}/${pckJson.version}/iframe\.html?viewMode=story&id=example-\", \"gitssh\": \"${params.gitcloneurl}\", \"commit-id\": \"${shortCommit}\", }' http://182.92.157.77:7001/api/v3/management/ci/components"
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
