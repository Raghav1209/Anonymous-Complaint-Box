# Authentication-Secrets

To inspect the code for the module, you can clone this repository and use git checkout to see the completed code for each lesson. 

This Contains Authentication using OAuth2.0 for google and github.

### OAuth - Open Authorisation (Token based)
We are able to access pieces of information on third party websites such as email contacts.

Secure authentication using third party apps.

### Why OAuth?
1. Granular Access Levels (Developers can see what data they need)
2. Read/ Read + write access (If you want to post things to third party app you need write permissions)


Revoke Access (Third should be able to revoke access at any point on their website)

### Steps for OAuth :
1. Set up your App In their developer console and we get a client-id. 
2. Redirect to Authenticate 
3. Take them to the third party website to login 
4. User Grants permissions to your app
5. Receive Authorisation Code from third party website
6. Exchange AuthCode for Access Token (if you need subsequent info)
	

### Serialize
It creates the cookie and stores the user's identifications.
	
### Deserialize 
It crumbles the cookie and discover the user's identification.
	
### Add Cookies and Sessions
Using passport - Simple, unobtrusive authentication for Node.js 
(http://www.passportjs.org/)


    npm i passport passport-local passport-local-mongoose express-session

	
#### Cookies: 
Website save some data from your previous session when you leave the site or get distracted. So that when you come next time it is saved already.
Also these cookies show you to come back to the website and continue by showing ads and stuff on the other website that you use.
	
### For Various third Party Authentication Methods
Visit (http://www.passportjs.org/packages/)

### Passport strategy for Google OAuth 2.0
(http://www.passportjs.org/packages/passport-google-oauth2/)

    npm install passport-google-oauth2

### Passport-GitHub2
(http://www.passportjs.org/packages/passport-github2/)

    npm install passport-github2

### Passport-Twitter
(https://www.passportjs.org/packages/passport-twitter/)

    npm install passport-twitter