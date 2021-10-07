# CcsClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
This will also generate a according test file. For components a template and a .scss file will be created as well.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Angular Setup
This project uses latest LTS version of Angular, which is Angular 12. To use this we need to install at least [NodeJs LTS 14.5](https://nodejs.org/en/download/).

To run this project you need to install angular cli globally. Use this link: [Angular CLI](https://github.com/angular/angular-cli).  
Run `npm install` once after checkout. This will install all dependencies defined in package.json file.  
There are several npm scripts which run angular cli tasks (defined in package.json file):
* `npm start` will run `ng serve` which provides a local web server and adds a file watcher
* `npm start-local` will run `ng serve` as well, but additinally runs a local configuration (servelocal), which simulates API calls without a running webserver (replaces http.service.ts with http.service.test.ts)
  * you can define configurations in angular.json file
* `npm build` will run `ng build`
* `npm build-prod` will run `ng build` but with production configuration, which includes mangling, file hashing etc. => this is the only build we use for production!
* `npm extract-i18n` will extract all missing translations and help to migrate the existing language files. See below for detailed information about Angular i18n
* There are some more tasks to run the angular scripts like test

When you run `npm start` there is a local web server started, but to access the API calls to the running server which runs the interface we need to define a `proxy.conf.json` file and tell Angular how to handle API calls.  
In `src` folder there is the according proxy file, where we can define the API route (`/rest` in this case), the server url, if we want to use websockets, if it must be https and some other options. To include the proxy.conf.json in our task we've added `--proxy-config src/proxy.conf.json`to the npm script `npm start`. This will all http calls with route `/rest` to the according server address.

## Development
This project was created with [Visual Studio Code](https://code.visualstudio.com/);  
There are several VS Code extensions which support Angular development, as well as formatter (Prettier, Beautify) and a helper like ESLint. On first run VS Code will ask you to install recommended extensions. ESLint can be run automtically with `ng lint`, `ng lint --fix` will fix all automatically fixable issues.
This project can also be run in other IDEs like WebStorm or any other solution you like.

## packages
Some npm packages are used for this project (for full list see package.json file):
* [Angular Material](https://material.angular.io/)
* [ngx-cookie-service](https://github.com/stevermeister/ngx-cookie-service)
* [d3js](https://d3js.org/) for graph handling
* [http-status-enum](https://github.com/KyleNeedham/http-status-enum)
* [ngx-i18nsupport](https://github.com/martinroob/ngx-i18nsupport)

## REST
This solutions uses the REST program paradigma. All API calls must follow the rules of the REST architecture. [Find more details](https://restfulapi.net/)  
This application uses a BaseHttpService to define all HTTP calls, which is implemented as an abstract class, consumed by the httpService and the demo httpService.test

## Styling
We configured Angular to use SCSS language to extend our normal CSS sheet. On build Angular will compile all scss file to one .css style sheet (defined in angular.json).  
As we use an Angular Material default theme, in angular.json we must include the theme style in out angular.json, too (`./node_modules/@angular/material/prebuilt-themes/indigo-pink.css`)  
We use a `variables.scss` to define global style variables, which we can use in every single .scss file.  

## i18n
Translation is done with [Angular i18n](https://angular.io/guide/i18n-overview). Base language is English. This allows to translate every single string with the help of an XLF file for each language in `src/i18n` folder.  
NOTE: to translate HTML attributes like `placeholder` just prefix them with i18n like `i18n-placeholder` to translate this strings as well.  
[We use the package ngx-i18nsupport to keep our language files updated](https://github.com/martinroob/ngx-i18nsupport/wiki/Tutorial-for-using-xliffmerge-with-angular-cli).  
By running the task `npm extract-i18n` all untranslated strings will be marked with `state="new"`. After translation set state to `final`.

### i18n deploy
By running `npm build-prod` you will create one folder per language in `dist` output folder. Languages and output must be defined in `angular.json` file.  
This means, that there is one build per language, as the whole site will be pre-generated for each language.
Keep in mind that the webserver must be configured to handle multiple language support and switching language will reload whole page. Best practice is to let the server check the `Accept-Language` HTTP header to detect preferred language and add a fallback language. 
[Example configurations can be found here](https://angular.io/guide/i18n-common-deploy)

## additional info
For HTTP error handling we use a [HttpInterceptor](https://angular.io/api/common/http/HttpInterceptor) called `ErrorInterCeptorService`. 
This service will check all HTTP calls and their responses. This allows to handle all HTTP errors and check outgoing calls for correct token using.  
Addtionally there is an CanActivateService which prevents not-logged-in users from accessing restricted routes defined in `app-routing.module.ts`. See [CanActivate](https://angular.io/api/router/CanActivate) for more details.  

* [d3js import in Typscript](https://stackoverflow.com/questions/38335087/correct-way-to-import-d3-js-into-an-angular-2-application) 
  * see `d3jsimport.ts` file 

## Testing
Running `ng test` will automatically run the full test suite (all .spec.ts files). To run only specific files or configurations for testing we can use the `--include` command.  
[See Angular Cli test options for more details](https://angular.io/cli/test#options).  
To debug test files in VS Code there is an additional launch configuration "Jasmine Debugger" which will allow to attach the VS Code Debugger to the Jasmine Test Process, by selecting the configuration in **Run and Debug** menu and press F5 or the run button after starting testing with `ng test` (with optional options):

NOTE: Difference between Testing and Build/Serve can lead to error messages, but tests will still succeed. [See here for detail information about JIT/AOT compiler usage](https://github.com/angular/angular/issues/36430). [Workaround here](https://github.com/angular/angular/issues/36430#issuecomment-742360228)

To succeed full test it is mandatory that the backend server where the API is located is running. 
To test routing within the angular app you can toggle the userservice.loggedIn property to check if routes which are blocked for not-logged-in users are working correctly. Routing test is defined in `app-routing.spec.ts` file 

## TODOS
url (material for content) validation necessary?  
binary content => general or content bound?  
download material/Url => zip?  
add uploadcontent => api  




