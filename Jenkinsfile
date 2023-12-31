#!/usr/bin/env groovy
//Shared library
@Library ('Korsgy-Shared-Library')_ 

pipeline {
    agent any
    tools {
        nodejs 'NodeJS'
    }
    environment {
        regDomain           = 'registry.digitalocean.com'
        regName             = "${regDomain}/ogc-reg"
        registryCredentials = 'ogc-reg-cred'
        imageName           = 'backend'
        clusterAPI          = 'DOKS-API-URL'
        clusterCredentials  = 'doks-config'
    }
    stages {

        stage('Increment Version') {
            when {
                expression {
                    BRANCH_NAME == 'main'
                }
            }
            steps {
                script {
                    echo "Incrementing ${imageName} version..."
                    // NOTE: Please change minor with major or patch, Depends on the Update.
                    sh 'npm version minor --no-git-tag-version'
                    sh 'chmod +x versionextract.sh'
                    APPL_VERSION = sh(
                        script: './versionextract.sh',
                        returnStdout: true
                    ).trim()
                    env.imageVersion = "${APPL_VERSION}"
                }
            }
        }
        stage('Build Image') {
            when {
                expression {
                    BRANCH_NAME == 'main'
                }
            }
            steps {
                script {
                    dockerLogin(env.registryCredentials , env.regName)
                    dockerBuild(env.regName , env.imageName , env.imageVersion)
                }
            }
        }
        stage('Push Image') {
            when {
                expression {
                    BRANCH_NAME == 'main'
                }
            }
            steps {
                script {
                   dockerPush(env.regName , env.imageName , env.imageVersion)
                }
            }
        }
        stage('Deploy to K8S Cluster') {
            when {
                expression {
                    BRANCH_NAME == 'main'
                }
            }
            steps {
                script {
                    withCredentials([string(credentialsId: "${clusterAPI}", variable: 'url')]) {
                        kubeDeploy(env.regName , env.imageName , env.imageVersion , env.clusterCredentials, "${url}") 
                    }
                }
            }
        }

        stage('Commit Version Update') {
            when {
                expression {
                    BRANCH_NAME == 'main'
                }
            }
            steps {
                script {
                    //Authenticating to git
                    withCredentials([usernamePassword(
                        credentialsId: 'ogc-gitlab',
                        passwordVariable: 'PASS',
                        usernameVariable: 'USER'
                    )]){
                        sh 'git config --global user.email "jenkins@example.com"'
                        sh 'git config --global user.name "jenkins"'
                        sh "git remote set-url origin https://${USER}:${PASS}@gitlab.com/korsgy-IT/ogc/ogc-backend.git"
                        sh 'git add .'
                        sh 'git commit -m "[ci-skip] Jenkins CI Version Update"'
                        sh 'git push origin HEAD:main'
                    }
                }
            }
        }
    }
    post {
        always {
            emailext    body: "${currentBuild.currentResult}: OGC- ${env.imageName} build ${env.BUILD_NUMBER}\n To view the result, check console output for more info at: \n $env.BUILD_URL/console",
                        to: '$DEFAULT_RECIPIENTS',
                        attachLog: true,
                        subject: "OGC-Backend - Build # $env.BUILD_NUMBER - ${currentBuild.currentResult}!"
        }
    }
}
