def call(String Project, String ImageTag, String dockerHubUser){
  withCredentials([usernamePassword(credentialsId: 'dockerHubCred', usernameVariable: 'dockerHubUser', passwordVariable: 'docjerHubPass')]) {
    sh "docker login -u ${dockerHubUser} -p ${dockerHubPass}"
  }
  sh "docker push ${dockerHubUser}/${Project}:${ImageTag}"
}
