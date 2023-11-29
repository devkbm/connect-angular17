import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login3',
  template: `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="800px" height="600px" viewBox="0 0 800 600" enable-background="new 0 0 800 600" xml:space="preserve">
  <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="174.7899" y1="186.34" x2="330.1259" y2="186.34" gradientTransform="matrix(0.8538 0.5206 -0.5206 0.8538 147.9521 -79.1468)">
    <stop offset="0" style="stop-color:#FFC035" />
    <stop offset="0.221" style="stop-color:#F9A639" />
    <stop offset="1" style="stop-color:#E64F48" />
  </linearGradient>
  <circle fill="url(#SVGID_1_)" cx="266.498" cy="211.378" r="77.668" />
  <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="290.551" y1="282.9592" x2="485.449" y2="282.9592">
    <stop offset="0" style="stop-color:#FFA33A" />
    <stop offset="0.0992" style="stop-color:#E4A544" />
    <stop offset="0.9624" style="stop-color:#00B59C" />
  </linearGradient>
  <circle fill="url(#SVGID_2_)" cx="388" cy="282.959" r="97.449" />
  <linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="180.3469" y1="362.2723" x2="249.7487" y2="362.2723">
    <stop offset="0" style="stop-color:#12B3D6" />
    <stop offset="1" style="stop-color:#7853A8" />
  </linearGradient>
  <circle fill="url(#SVGID_3_)" cx="215.048" cy="362.272" r="34.701" />
  <linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="367.3469" y1="375.3673" x2="596.9388" y2="375.3673">
    <stop offset="0" style="stop-color:#12B3D6" />
    <stop offset="1" style="stop-color:#7853A8" />
  </linearGradient>
  <circle fill="url(#SVGID_4_)" cx="482.143" cy="375.367" r="114.796" />
  <linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="365.4405" y1="172.8044" x2="492.4478" y2="172.8044" gradientTransform="matrix(0.8954 0.4453 -0.4453 0.8954 127.9825 -160.7537)">
    <stop offset="0" style="stop-color:#FFA33A" />
    <stop offset="1" style="stop-color:#DF3D8E" />
  </linearGradient>
  <circle fill="url(#SVGID_5_)" cx="435.095" cy="184.986" r="63.504" />
</svg>

<div class="container">
  <h2>login</h2>
  <form>
    <input type="text" class="email" placeholder="email">
    <br />
    <input type="text" class="pwd" placeholder="password">
  </form>
  <a href="#" class="link">
    forgot your password ?
  </a>
  <br />
  <button class="register">
    <span>register</span>
  </button>
  <button class="signin">
    <span>sign in</span>
  </button>
  <h3>your registration is complete ! </h3>
  <h3>your sign in is complete !</h3>
  <div class="reg"></div>
  <div class="sig"></div>

</div>
  `,
  styles: [`
* {
  margin: 0;
  padding: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

body {
  font-family: "Open Sans", sans-serif;
  background: #e2e2e2;
}

svg {
  position: fixed;
  top: 10px;
  left: 180px;
}

.container {
  position: relative;
  top: 200px;
  left: 35%;
  display: block;
  margin-bottom: 80px;
  width: 500px;
  height: 360px;
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
  z-index: 1;
}

h2 {
  padding: 40px;
  font-weight: lighter;
  text-transform: uppercase;
  color: #414141;
}

input {
  display: block;
  height: 50px;
  width: 90%;
  margin: 0 auto;
  border: none;
}
input::placeholder {
  -webkit-transform: translateY(0px);
  transform: translateY(0px);
  -webkit-transition: 0.5s;
  transition: 0.5s;
}
input:hover, input:focus, input:active:focus {
  color: #ff5722;
  outline: none;
  border-bottom: 1px solid #ff5722;
}
input:hover::placeholder, input:focus::placeholder, input:active:focus::placeholder {
  color: #ff5722;
  position: relative;
  -webkit-transform: translateY(-20px);
  transform: translateY(-20px);
}

.email,
.pwd {
  position: relative;
  z-index: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-left: 20px;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
  color: #858585;
  font-weight: lighter;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}

.link {
  text-decoration: none;
  display: inline-block;
  margin: 27px 28%;
  text-transform: uppercase;
  color: #858585;
  font-weight: lighter;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}

button {
  cursor: pointer;
  display: inline-block;
  float: left;
  width: 250px;
  height: 60px;
  margin-top: -10px;
  border: none;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
  color: #fff;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}
button:nth-of-type(1) {
  background: #673ab7;
}
button:nth-of-type(2) {
  background: #ff5722;
}
button span {
  position: absolute;
  display: block;
  margin: -10px 20%;
  -webkit-transform: translateX(0);
  transform: translateX(0);
  -webkit-transition: 0.5s;
  transition: 0.5s;
}
button:hover span {
  -webkit-transform: translateX(30px);
  transform: translateX(30px);
}

.reg {
  position: absolute;
  top: 0;
  left: 0;
  -webkit-transform: translateY(-100%) scale(1);
  transform: translateY(-100%) scale(1);
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50px;
  background: #673ab7;
  z-index: 5;
  -webkit-transition: 0.8s ease-in-out;
  transition: 0.8s ease-in-out;
}

.sig {
  position: absolute;
  top: 0;
  right: 0;
  -webkit-transform: translateY(-100%) scale(1);
  transform: translateY(-100%) scale(1);
  display: block;
  width: 20px;
  height: 20px;
  display: block;
  background: #ff5722;
  z-index: 5;
  -webkit-transition: 0.8s ease-in-out;
  transition: 0.8s ease-in-out;
}

h3 {
  position: absolute;
  top: -100%;
  left: 20%;
  text-transform: uppercase;
  font-weight: bolder;
  color: rgba(255, 255, 255, 0.3);
  -webkit-transition: 0.3s ease-in-out 1.2s;
  transition: 0.3s ease-in-out 1.2s;
}
  `]
})
export class Login3Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
