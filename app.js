const express = require('express');
const jsforce = require('jsforce');
const app = express();

const port = process.env.PORT || 3000;

var conn = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://test.salesforce.com',
  });
  const username="sample";
  const password="";
  conn.login(username, password, function(err, userInfo) {
    if (err) { return console.error(err); }
    // Now you can get the access token and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.instanceUrl);
    // logged in user property
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    console.log(conn);
  });

//jsForce connection
const oauth2 = new jsforce.OAuth2({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://test.salesforce.com',
    //clientId and Secret will be provided when you create a new connected app in your SF developer account
    clientId : '',
    clientSecret : '',
    //redirectUri : 'http://localhost:' + port +'/token'
    redirectUri : 'http://localhost:3000/token'
});

app.get("/",(req,res) => {

    res.send("Awesome start of course");
});


app.get("/accounts",(req,res) => {

    conn.query("SELECT Id, Name FROM Account", function(err, result) {
        if (err) { return console.error(err); }
        console.log(result);
        console.log("total : " + result.totalSize);
        console.log("fetched : " + result.records.length);
      });

      return res.send("success");;

});

app.get("/auth/login", function(req, res) {
    // Redirect to Salesforce login/authorization page
    res.redirect(oauth2.getAuthorizationUrl({scope: 'api id web refresh_token'}));
  });


  app.get('/token', function(req, res) {
    const conn = new jsforce.Connection({oauth2: oauth2});
        const code = req.query.code;
        conn.authorize(code, function(err, userInfo) {
            if (err) { return console.error("This error is in the auth callback: " + err); }
    console.log('Access Token: ' + conn.accessToken);
            console.log('Instance URL: ' + conn.instanceUrl);
            console.log('refreshToken: ' + conn.refreshToken);
            console.log('User ID: ' + userInfo.id);
            console.log('Org ID: ' + userInfo.organizationId);
            // req.session.accessToken = conn.accessToken;
            // req.session.instanceUrl = conn.instanceUrl;
            // req.session.refreshToken = conn.refreshToken;
    var string = encodeURIComponent('true');
           /* res.redirect('http://localhost:3000/?valid=' + string);
        });*/

        conn.query("SELECT Id, Name FROM Account", function(err, result) {
            if (err) { return console.error(err); }
            console.log(result);
            console.log("total : " + result.totalSize);
            console.log("fetched : " + result.records.length);
          });
        res.send("success");
    });

});






app.listen(port, () => {

    console.log("App is running on port:"+port);
});
