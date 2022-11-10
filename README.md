**How this project works**
#### Android

Followed the manual configuration for the [react native thread](https://github.com/joltup/react-native-threads#android-1)
as shown below: 
1.  Opened up  `android/app/src/main/java/[...]/MainApplication.java`

-   Added  `import com.reactlibrary.RNThreadPackage;`  to the imports at the top of the file
-   Added  `new RNThreadPackage(mReactNativeHost)`  to the list returned by the  `getPackages()`  method

2.  Appended the following lines to  `android/settings.gradle`:
    
    ```
    include ':react-native-threads'
    project(':react-native-threads').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-threads/android')
    
    ```
    
3.  Inserted the following lines inside the dependencies block in  `android/app/build.gradle`:
    
    ```
      compile project(':react-native-threads')
    ```
4. Created a js file called  `thread.js` which is used to activate the thread workers. 
  
         import { self } from 'react-native-threads';

        //listen for messages
        self.onmessage = (message) => { }
        //send a message, strings only
         self.postMessage('hello');

5. Created a React hook `/hooks/useThread.js` for instantiating the thread method

#### Example App
 
 From the `App.js` component file I created a messaging example app, used for testing the [react native thread](https://github.com/joltup/react-native-threads#android-1) which works pretty well. I also created a fibonacci example function, which is an expensive calculation for testing this library.  Using this library for this calculation does not work pretty well because, a worker thread is only started after the main RN thread is running, making this a slow process as it happens in serial.

To solve this problem, I installed [react native multi threading](https://github.com/mrousavy/react-native-multithreading) package, which supports [JSI](https://github.com/react-native-community/discussions-and-proposals/issues/91).
Since [JSI](https://github.com/react-native-community/discussions-and-proposals/issues/91) is becoming more mainstream, there might be functions that are actually blocking and take a while to execute. For example, a storage library like [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) or fibonacci recursive function might take a few milliseconds to execute a complex call. Since the whole idea is to avoid our entire RN thread to freeze when doing that, since users will perceive a noticeable lag or freeze.

This package simply off-load such expensive calculations/blocking calls to a separate thread with almost no overhead while the main RN thread can concentrate on running our app's business logic, respond to user input, update state and more. 

**NOTE:** 
I could not test some part of this project due to some errors encountered while modifying the native codes. Also, due to the errors encountered I could not make modification for the IOS version of this project.  However,  the reviewer can look through the code patterns to understand the whole concept.