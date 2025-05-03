# Awesome-android-tooling

![Vibrant Illustration for GitHub Repo](https://github.com/user-attachments/assets/da541d1d-a2cf-477b-85b6-de70ad91ce18)


Awesome Android tooling! Discover a curated list of top libraries, frameworks, and utilities for building, testing, and optimizing your Android apps. Boost your development workflow and app quality with these essential resources.

## Command Line Tools
The Android SDK is composed of multiple packages that are required for app development. This page lists the most important command-line tools that are available, organized by the packages in which they're delivered.  
[More Detail](https://developer.android.com/tools)

### ADB (Android Debug Bridge)
A command-line tool that facilitates communication between your development PC and Android devices, enabling debugging and testing.  
[More Detail](https://developer.android.com/tools/adb)


### AAPT2
AAPT2 (Android Asset Packaging Tool) is a build tool that Android Studio and Android Gradle Plugin use to compile and package your app's resources. AAPT2 parses, indexes, and compiles the resources into a binary format that is optimized for the Android platform.  
[More Detail](https://developer.android.com/tools/aapt2)


### apkanalyzer
The command-line version of APK Analyzer provides immediate insight into the composition of your APK after the build process completes and lets you compare differences between two APKs. Using APK Analyzer reduces the time you spend debugging issues with DEX files and resources within your app and reduces the size of your APK.  
[More Detail](https://developer.android.com/tools/apkanalyzer)

### apksigner
The `apksigner` tool, available in revision 24.0.3 and higher of the Android SDK Build Tools, lets you sign APKs and confirm that an APK's signature will be verified successfully on all versions of the Android platform supported by that APK.  
[More Detail](https://developer.android.com/tools/apksigner)

### avdmanager
The `avdmanager` is a command-line tool that lets you create and manage Android Virtual Devices (AVDs) from the command line. An AVD lets you define the characteristics of an Android handset, Wear OS watch, or Android TV device that you want to simulate in the Android Emulator.  
[More Detail](https://developer.android.com/tools/avdmanager)


### bmgr
bmgr is a shell tool you can use to interact with the Backup Manager on Android devices version 2.2 (API Level 8) or higher. The tool provides commands to initiate backup and restore operations so that you don't need to repeatedly wipe data or take similar intrusive steps in order to test your application's backup functionality. The bmgr tool supports both Auto Backup and Key/Value Backup.  
[More Detail](https://developer.android.com/tools/bmgr)

### bundletool
`bundletool` is the underlying tool that Android Studio, the Android Gradle plugin, and Google Play use to build an Android App Bundle. bundletool can convert an app bundle into the various APKs that are deployed to devices.  
[More Detail](https://developer.android.com/tools/bundletool)


### d8
`d8` is a command-line tool that Android Studio and the Android Gradle plugin use to compile your project's Java bytecode into DEX bytecode that runs on Android devices. d8 lets you use Java 8 language features in your app's code.  
[More Detail](https://developer.android.com/tools/d8)

### dmtracedump
`dmtracedump` is a tool that generates graphical call-stack diagrams from trace log files. The tool uses the Graphviz Dot utility to create the graphical output, so you need to install Graphviz before running dmtracedump. If you haven't yet generated trace logs and saved them from your connected device to your local machine, go to Generate trace logs by instrumenting your app.  
[More Detail](https://developer.android.com/tools/dmtracedump)

### dumpsys
`dumpsys` is a tool that runs on Android devices and provides information about system services. Call dumpsys from the command line using the Android Debug Bridge (ADB) to get diagnostic output for all system services running on a connected device.   
[More Detail](https://developer.android.com/tools/dumpsys)

### etc1tool
`etc1tool` is a command line utility that lets you encode PNG images to the ETC1 compression standard and decode ETC1 compressed images back to PNG.   
[More Detail](https://developer.android.com/tools/etc1tool)

### jobb
The `jobb` tool lets you build encrypted and unencrypted APK expansion files in Opaque Binary Blob (OBB) format. You can download and mount these expansion files in your application using StorageManager on devices with Android 2.3 (API Level 9) or higher. OBB files provide additional file assets for Android applications, such as graphics, sounds, and video, separate from an application's APK file. For more information on using expansion files, see APK Expansion Files.   
[More Detail](https://developer.android.com/tools/jobb)


### Jetifier
The standalone Jetifier tool migrates support-library-dependent libraries to instead rely on the equivalent AndroidX packages. The tool lets you migrate an individual library directly instead of using the Android Gradle plugin bundled with Android Studio.      
[More Detail](https://developer.android.com/tools/jetifier)

### Logcat command-line tool 
Logcat is a command-line tool that dumps a log of system messages including messages that you have written from your app with the Log class.      
[More Detail](https://developer.android.com/tools/logcat)

### mksdcard
Use the mksdcard tool to create a FAT32 disk image that you can load into emulators running different Android Virtual Devices (AVDs) to simulate the presence of the same SD card in multiple devices.      
[More Detail](https://developer.android.com/tools/mksdcard)

### R8 retrace
R8 retrace is a tool for obtaining the original stack trace from an obfuscated stack trace. The stack trace is reconstructed by matching class and method names in a mapping file to their original definitions.      
[More Detail](https://developer.android.com/tools/retrace)

### sdkmanager
The `sdkmanager` is a command-line tool that lets you view, install, update, and uninstall packages for the Android SDK. If you're using Android Studio, then you don't need to use this tool, and you can instead manage your SDK packages from the IDE.      
[More Detail](https://developer.android.com/tools/sdkmanager)

### sqlite3
From a remote shell to your device or from your host machine, use the sqlite3 command-line program to manage SQLite databases created by Android applications. The sqlite3 tool includes many useful commands, such as .dump to print out the contents of a table and .schema to print the SQL CREATE statement for an existing table. The tool also gives you the ability to execute SQLite commands on the fly.         
[More Detail](https://developer.android.com/tools/sqlite3)

### perfetto
`perfetto` is a tool that lets you collect performance information from Android devices via the Android Debug Bridge (ADB).          
[More Detail](https://developer.android.com/tools/perfetto)

### zipalign
`zipalign` is a zip archive alignment tool that helps ensure that all uncompressed files in the archive are aligned relative to the start of the file. This lets the files be accessed directly via mmap(2) , removing the need to copy this data in RAM and reducing your app's memory usage.          
[More Detail](https://developer.android.com/tools/zipalign)


### Layout Inspector
Enables you to inspect and debug the layout of your UI in an emulator or physical device.

### Build Tools:
Android Studio utilizes the Gradle build system, which allows you to customize the build process, generate multiple build variants, and analyze build performance.
