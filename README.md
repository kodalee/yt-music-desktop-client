<div id="top"></div>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/hellokoda/yt-music-desktop-client">
    <img src="https://music.youtube.com/img/on_platform_logo_dark.svg" alt="Logo" width="200" >
  </a>

<h3 align="center">YT Music Desktop Client</h3>

  <p align="center">
    A Desktop Client for the YouTube Music service.
    <br />
    <a href="https://github.com/hellokoda/yt-music-desktop-client/releases"><strong>Download »</strong></a>
    <br />
    <br />
    <a href="https://github.com/hellokoda/yt-music-desktop-client/issues">Report Bug</a>
    ·
    <a href="https://github.com/hellokoda/yt-music-desktop-client/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
Since Google doesn't want to make a Desktop Client for their YouTube Music service which in turn requires people to use a browser, and Google Chrome is such as RAM hog, I just went ahead and made a client for the YT Music Service myself.

I do not own any of the logos displayed.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [Electron.js](https://electronjs.org/)
* [JQuery](https://jquery.com)
* HTML
* MaterializeCSS

<p align="right">(<a href="#top">back to top</a>)</p>

### Security Warning
SECURITY FLAGS ARE DISABLED, WHICH LEAVES YOUR SAFETY TO YOURSELF, DO NOT CLICK ANY MALICIOUS LINKS YOU MAY SEE IN DESCRIPTIONS, OPEN THEM IN DIFFERENT BROWSERS. YOU HAVE BEEN WARNED.

<!-- GETTING STARTED -->
## Getting Started

To setup your own build of this client, just follow these steps.

### Installation

Download and launch YTMusicSetup.exe from the [releases](https://github.com/hellokoda/yt-music-desktop-client/releases/) page

### Prerequisites

* NodeJS ^14.0.0 (LTS)
* Git
* IDE (Visual Studio Code is a good canidate)
* A Brain (pretty self explainatory)

### Source Cloning

1. Clone the repo
   ```cmd
   C:\yt-music> git clone https://github.com/hellokoda/yt-music-desktop-client.git
   ```
2. Install NPM packages (--verbose is not required but its good to show the progress)
   ```cmd
   C:\yt-music> npm install --verbose
   ```
3. Have fun! You now have your own clone of this repository.

### Debugging

DevTools is allowed by default and can be trigger by pressing the <code>CTRL + SHIFT + F11</code> key pattern.

To open the app without packing & building it, just open your local repository in a command prompt or a Git Bash and type the following:
```cmd
C:\yt-music> npm run start

> ytmusic@1.0.1 start C:\yt-music
> electron-forge start

✔ Checking your system
✔ Locating Application
✔ Preparing native dependencies
✔ Launching Application

You launching this thru a terminal?? Damn well okay!
Lets get started shall we?
... you get the point ...
```

### Building

Warning: This repository already comes with a configurated build setup to target Windows 64-bit with Squirrel.Windows, if you want to build in something else, you will have to take a gander at [electron-builder](https://electron.build/)'s documentation

Once you are ready to build the client, simply open your local repository in a command prompt or a Git Bash and follow the steps:

* Always make sure the dist/ folder is deleted, otherwise you will end up packing an already built app into your build. Will up the size x~100 MB every time.
```cmd
C:\yt-music> npm run dispose

> ytmusic@1.0.1 dispose C:\yt-music
> node dispose.js

attempting to clean up the dist/ folder...
succesfully cleaned up the dist/ folder. you may now build the app
``` 
* Execute the build operation
```cmd
C:\yt-music> npm run build

> ytmusic@1.0.1 build C:\Users\Koda\Desktop\yt-music
> electron-builder --x64

  • electron-builder  version=22.14.13 os=10.0.19042
  • loaded configuration  file=package.json ("build" field)
  • writing effective config  file=dist\builder-effective-config.yaml
  • packaging       platform=win32 arch=x64 electron=15.1.1 appOutDir=dist\win-unpacked
  • building        target=Squirrel.Windows arch=x64 file=dist\squirrel-windows\YouTube Music Setup 1.0.1.exe
  -- DONE --
```
* And you then got yourself the YT Music Client in 2 forms. Unpacked and Packed:
```
yt-music-desktop-client/
|- dist/
|   |- win-unpacked/
|      |- locales/
|      |- resources/
|      |- swiftshader/
|      |- YouTube Music.exe <-- UNPACKED CLIENT
 ```
```
yt-music-desktop-client/
|- dist/
|   |- squirrel-windows/
|      |- YouTube Music Setup 1.0.1.exe <-- PACKED CLIENT
 ```
 Distrubute it however you'd like, for example, you can [fork this repository](https://github.com/hellokoda/yt-music-desktop-client/fork)!
<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

* <p>Start splash:</p>
  <img src="https://i.koda.life/3206c71c.jpg" width="300">
* <p>Home:</p>
  <img src="https://i.koda.life/9412cc01.jpg" width="300">
* <p>Settings:</p>
  <img src="https://i.koda.life/294453c9.jpg" width="300">
* <p>Discord RPC:</p>
  <img src="https://i.koda.life/e7ecbc5d.jpg" width="300">

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] Integrate Discord RPC
    - [ ] Fix Album Artwork Issues
- [ ] Finish the settings page and integration
    - [ ] Make settings.html look better
    - [ ] Locally store the settings via JSON in %appdata%

See the [open issues](https://github.com/hellokoda/yt-music-desktop-client/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Koda Lee Allen - [@kodalee4](https://twitter.com/kodalee4) - me@koda.life

Project Link: [https://github.com/hellokoda/yt-music-desktop-client](https://github.com/hellokoda/yt-music-desktop-client)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [InfaRedx](https://github.com/InfaRedx) - Ideas (Discord RPC Integration)
* [peenhvh69](https://github.com/peenhvh69) - Ideas (This whole project)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/hellokoda/yt-music-desktop-client.svg?style=for-the-badge
[contributors-url]: https://github.com/hellokoda/yt-music-desktop-client/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/hellokoda/yt-music-desktop-client.svg?style=for-the-badge
[forks-url]: https://github.com/hellokoda/yt-music-desktop-client/network/members
[stars-shield]: https://img.shields.io/github/stars/hellokoda/yt-music-desktop-client.svg?style=for-the-badge
[stars-url]: https://github.com/hellokoda/yt-music-desktop-client/stargazers
[issues-shield]: https://img.shields.io/github/issues/hellokoda/yt-music-desktop-client.svg?style=for-the-badge
[issues-url]: https://github.com/hellokoda/yt-music-desktop-client/issues
[license-shield]: https://img.shields.io/github/license/hellokoda/yt-music-desktop-client.svg?style=for-the-badge
[license-url]: https://github.com/hellokoda/yt-music-desktop-client/blob/master/LICENSE
[product-screenshot]: images/screenshot.png
