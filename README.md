# Amplio Suite

- [Amplio Suite](#amplio-suite)
  - [1. Local](#1-local)
    - [1.2. Starting your local server](#12-starting-your-local-serve)
  - [2. Production](#2-production)
    - [2.1. Deploy to "stable"](#21-deploy)
  - [3. Tailwind convention](#3-tailwind-convention)
  - [4. API gateway](#4-api-gateway)
  - [5. Minimum browser requirements](#5-minimum-browser-requirements)
    - [5.1. Browsers versions](#51-browsers-versions)
    - [5.2. Screen resolutions](#5-screen-resolutions)
  - [6. Obsolete Lambda functions](#6-obsolete-lambdas)

## 1. Local

### 1.1. Starting your local server
When you are ready to test the Vue code, ```cd frontend``` and run
```bash
yarn serve
```

When you are finished with your test environment, use ```Ctrl+C``` to kill the web server.
## 2. Production

### 2.1. Deploy to "stable"
To deploy the Vue application to production, merge the changes into ```stable``` branch and push.

  **NOTE: Be absolutely sure to do a "fast-forward" merge only!**

## 3. Tailwind convention

tl;dr:
"Tailwind" was used for the initial project. 

####Details:
Tailwind is an admission that "CSS is hard" and that HTML & CSS are fundamentally broken.
Tailwind essentially eliminates style sheets, and applies formatting and styling directly.

We will use tailwind css for styling and the classes will be applied in the following order:
- spacing will be only top and left
- classes will be listed in the order: layout/flex/position, spacing, text style, colors, decorations/borders/shadows/etc and lastly the pseudo state modifiers (ej. :hover, :focus)

## 4. API gateway
Authentication is provided through Amazon AWS Cognito. Using the "Lambda Integration" feature of API gateway, the user's
authentication information can be passed through to the Lambda functions that perform all server operations.

AWS Lambda functions are extremely convenient, but there is some overhead "spinning up" a function. It is best to 
group related functionality together into the same function, so that some of the startup overhead can be avoided.

## 5. Minimum browser requirements

### 5.1. Browsers versions
We only support the latest and one previous versions of modern browsers. Supporting old versions is not doing
our customers any favors.

### 5.2. Screen resolutions
The minimum supported screen resolution is 1366x768. Mobile devices and screen resolutions less than 1366x768 are not supported.

## 6. Obsolete Lambda Functions
The lambda functions in this directory are obsolete and are no longer in use. They were part of the original
InSTEDD code, and were not of production quality. (Not only is the code uncommented and inscrutable, each
source file is deployed _multiple times_, once for each published function, thereby providing the worst-case
performance scenario for AWS Lambda, by paying a startup cost of every single function. Oy. They did provide
for running the functions locally, in Docker, but those are completely un-debuggable, so we're better off
simulating the Lambda calling conventions from a ```def __main__()``` function.)