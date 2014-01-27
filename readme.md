# Sika App Docs #
---

## Improvements  ##
* Swipes
* Animation of front page
* Auto init data on first load
* .ipa filesize decrease
* Data update check (is data out of date?)
* Client download script branding
* Header responsiveness improvement
* Rebuild update code

## CMD Commands  ##

### Sass ###
#### Compile ####
"cd /Users/james/dev/sika_app"
"compass compile resources"
CSS is output to "resources/css"

### Deploy App ###


#### Generate .app ####

The app generation process uses a file with the sencha project file to compile the app.
The file will be named like 'ipad.json'. It contain all of the build option for the compile process.
the name of the file should reflect with device it will build for. examples would be ipad.json, iphone.json and universal.json for both.
To configure a new build file, you should begin with a file that you know works, and change the setting accordingly.

Open Terminal
"cd /Users/james/dev/sika_app"
"sencha app package build ipad.json"
.app output to "/Users/james/dev/build".
Drag the app and certificate to iTunes.

#### Generate .ipa ####
Follow "Generate .app" above.
Drag the app from iTunes app library to, /Users/james/dev/build.

#### Deploy to Client ####
Rename the "/Users/james/dev/build/Sika Liquid Plastics.ipa" to "sika.ipa".
Load the "Beyond Compare" session "resources".
"Beyond Compare" navigate to "/Users/james/dev/build" and "ftp://cfa-uat@cfa-uat.com/domains/resources.cfa-uat.com/public_html/sika/".
Copy "/Users/james/dev/build/sika.ipa" to "ftp://cfa-uat@cfa-uat.com/domains/resources.cfa-uat.com/public_html/sika/sika.ipa".
Public url "http://resources.cfa-uat.com/sika/".

#### Ignore (Not Working) ####
* sudo xcrun -sdk iphoneos PackageApplication \
"/Users/james/dev/build/Payload/sika.app" \
-o "/Users/james/dev/build/sika.ipa" \
--sign "iPhone Developer: Mike Summers (92UHPYVD9U)" \
--embed "/users/James/dev/certificates/Sika_Liquid_Plastics_App_Dist_NEWEST.mobileprovision"

## Tools ##
* Markdown Editor : <http://markable.in/editor/>
* Sass Compiler : Compass (Terminal, compass --help)

## Resourses ##
### Files ###
* Project Root : /Users/james/dev/sika_app/
* Xcode Cert : /users/James/dev/certificates/Sika_Liquid_Plastics_App_Dist_NEWEST.mobileprovision
* iPad ipa : /Users/james/dev/build/sika.ipa
* App : /Users/james/dev/build/sika.app

### Urls ###
#### Local ####
* App : <http://sika.local/>

#### Dev ####
* App : <http://sika-app.cfa-dev.me/app/>
* CMS : <http://sika-app.cfa-dev.me/cms_2>
* Data : <http://sika-app.cfa-dev.me/categories/>
* Data : <http://sika-app.cfa-dev.me/projects/>

#### UAT ####
* CMS : <http://sika-app.cfa-uat.com/cms_2>
* Data : <http://sika-app.cfa-uat.com/categories/>
* Data : <http://sika-app.cfa-uat.com/projects/>
* Client Download : <http://resources.cfa-uat.com/sika/>

#### Other ####
* Docs : <http://docs.sencha.com/touch/2.3.0/>
* Example Map : <http://maps.google.com/maps/api/staticmap?&markers=B18%206DX&center=birmingham%20uk&zoom=10&size=683x546&format=png&maptype=roadmap&mobile=false&language=&markers=1&key=&sensor=false>
* Project : <http://milhouse/projects/sika-liquid-ipad>

## Bugs ##
### Open ###

#### 2013/11/05 - Header not displaying correctly on iPad when in portrait mode. ####
>Comment : Not looked into.

#### 2013/11/05 - CMS map generator not loading existing links nto the editor. ####
>Comment : Not looked into.

#### 2013/11/05 - CMS map generator not previewing map links. ####
>Comment : Not looked into.

#### 2013/11/05 - Sika title graphic not displaying within the project view. ####
>Comment : Graphic div not yet located or analysed.
>> File : /Users/james/dev/sika_app/app/view/tablet/Project/CarouselContainer.js.
>> CSS : .project-footertitle-panel.
>> File : ../images/footer-title-panel.png.

#### 2013/11/05 - Update after the init load causes a page transition. ####
>Comment : Look at /Users/james/dev/sika_app/app/controller/Category.js : line 260 - 321.

### Closed ###
#### 2013/11/01 - Map Data not refreshing within the app. ####

>Comment : Problem located within the category controller, the existing data wasn't getting cleared and update code wasn't written.
>> File : /Users/james/dev/sika_app/app/controller/Category.js
