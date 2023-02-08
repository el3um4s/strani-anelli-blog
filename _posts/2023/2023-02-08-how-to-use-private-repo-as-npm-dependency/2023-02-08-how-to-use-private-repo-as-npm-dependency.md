---
title: "How To Use Private Repo as NPM Dependency"
subtitle: ""
published: true
usa_webp: true
header:
  immagine_tipo: "jpg"
  miniatura: "image"
  immagine_estesa: "image"
  immagine_fonte: "Photo credit: [**Samuele**](https://blog.stranianelli.com/)"
  overlay_filter: rgba(79, 79, 79, 0.5)
date: "2023-02-08 15:50"
categories:
  - js
  - ts
  - javascript
  - typescript
tags:
  - js
  - ts
  - javascript
  - typescript
---

In the last few days I have been working a lot on some private projects. For confidentiality reasons I can't use public repositories, consequently not even the free version of NPM for dependency management. As a result I had to find a way to handle private dependencies.

I'll start by saying one thing: the optimal solution is to use the pro version of NPM (all in all it costs little, 7 dollars a month). But if you don't have the possibility to do so, you can create a library directly on GitHub, leaving the repository private and creating an access token for access via NPM.

```json
{
  "dependencies": {
    "package-name": "git+https://<username>:<access_token>@github.com/username/repository#{branch|tag}"
  }
}
```

This way you can install the library as if it were an npm package. To Create Personal Access Token on GitHub, from your GitHub account, go to Settings → Developer Settings → Personal Access Token → Generate New Token (Give your password) → Fillup the form → click Generate token → Copy the generated Token, it will be something like `ghp_sFhFsSHhTzMDreGRLjmks4Tzuzgthdvfsrta`

A second alternative, which does not require entering the plaintext token, is to add an SSH key to the git client:

```json
{
  "dependencies": {
    "package-name": "git+ssh://git@github.com:username/repository.git#{branch|tag}"
  }
}
```

To manage access token you can follow this answer on [StackOverflow](https://stackoverflow.com/questions/68775869/message-support-for-password-authentication-was-removed-please-use-a-personal).

For **Windows** you can go to Credential Manager from Control Panel → Windows Credentials → find `git:https://github.com` → Edit → On Password replace with with your GitHub Personal Access Token → You are Done

If you don’t find `git:https://github.com` → Click on Add a generic credential → Internet address will be `git:https://github.com` and you need to type in your username and password will be your GitHub Personal Access Token → Click Ok and you are done
