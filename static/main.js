'use strict'; var _createClass = function () { function d(a, c) { for (var b = 0; b < c.length; b++) { var e = c[b]; e.enumerable = e.enumerable || !1; e.configurable = !0; "value" in e && (e.writable = !0); Object.defineProperty(a, e.key, e) } } return function (a, c, b) { c && d(a.prototype, c); b && d(a, b); return a } }(); function _possibleConstructorReturn(d, a) { if (!d) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return !a || "object" !== typeof a && "function" !== typeof a ? d : a }
    function _inherits(d, a) { if ("function" !== typeof a && null !== a) throw new TypeError("Super expression must either be null or a function, not " + typeof a); d.prototype = Object.create(a && a.prototype, { constructor: { value: d, enumerable: !1, writable: !0, configurable: !0 } }); a && (Object.setPrototypeOf ? Object.setPrototypeOf(d, a) : d.__proto__ = a) } function _classCallCheck(d, a) { if (!(d instanceof a)) throw new TypeError("Cannot call a class as a function"); }
    var shaderData = { uniforms: { iResolution: { type: "v2", value: [window.innerWidth, window.innerHeight] }, vTextureSize: { type: "v2", value: [0, 0] }, uTextureForeground: { type: "sampler2D", value: null }, uTextureBackground: { type: "sampler2D", value: null }, uTextureDropShine: { type: "sampler2D", value: null } }, fragment: '\n        precision mediump float;\n    \n        //Textures\n        uniform sampler2D uTextureForeground;\n        uniform sampler2D uTextureBackground;\n        uniform sampler2D uTextureDropShine;\n        \n        //Canvas image data\n        uniform sampler2D uSampler;\n    \n        //The resolution and coordinates of the current pixel\n        uniform vec2 iResolution;\n        uniform vec2 vTextureSize;\n        varying vec2 vTextureCoord;\n        \n        //Function to get the vec2 value of the current coordinate\n        vec2 texCoord(){\n            return vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y) / iResolution;\n        }\n\n        //Scales the bg up and proportionally to fill the container\n        vec2 scaledTextureCoordinate(){\n            float ratioCanvas \x3d iResolution.x / iResolution.y;\n            float ratioImage \x3d vTextureSize.x / vTextureSize.y;\n            \n            vec2 scale \x3d vec2(1, 1);\n            vec2 offset \x3d vec2(0, 0);\n            float ratioDelta \x3d ratioCanvas - ratioImage;\n\n            if(ratioDelta \x3e\x3d 0.0){\n                scale.y \x3d (1.0 + ratioDelta);\n                offset.y \x3d ratioDelta / 2.0;\n            }else{\n                scale.x \x3d (1.0 - ratioDelta);\n                offset.x \x3d -(ratioDelta / 2.0);\n            }\n\n            return (texCoord() + offset) / scale;\n        }\n        \n        //Alpha-blends two colors\n        vec4 blend(vec4 bg, vec4 fg){\n            vec3 bgm \x3d bg.rgb * bg.a;\n            vec3 fgm \x3d fg.rgb * fg.a;\n            float ia \x3d 1.0 - fg.a;\n            float a \x3d (fg.a + bg.a * ia);\n            \n            vec3 rgb;\n            \n            if(a !\x3d 0.0){\n                rgb \x3d (fgm + bgm * ia) / a;\n            }else{\n                rgb \x3d vec3(0.0,0.0,0.0);\n            }\n            \n            return vec4(rgb,a);\n        }\n        \n        vec2 pixel(){\n            return vec2(1.0, 1.0) / iResolution;\n        }\n        \n        //Get color from fg\n        vec4 fgColor(){\n            return texture2D(uSampler, vTextureCoord);\n        }\n                \n        void main(){\n            vec4 bg \x3d texture2D(uTextureBackground, scaledTextureCoordinate());\n            vec4 cur \x3d fgColor();\n\n            float d \x3d cur.b; // "thickness"\n            float x \x3d cur.g;\n            float y \x3d cur.r;\n            float a \x3d smoothstep(0.65, 0.7, cur.a);\n            \n            vec4 smoothstepped \x3d vec4(y, x, d, a);\n\n            vec2 refraction \x3d (vec2(x, y) - 0.5) * 2.0;\n            vec2 refractionPos \x3d scaledTextureCoordinate() + (pixel() * refraction * (256.0 + (d * 512.0)));\n            vec4 tex \x3d texture2D(uTextureForeground, refractionPos);\n            \n            float maxShine \x3d 390.0;\n            float minShine \x3d maxShine * 0.18;\n            vec2 shinePos \x3d vec2(0.5, 0.5) + ((1.0 / 512.0) * refraction) * -(minShine + ((maxShine-minShine) * d));\n            vec4 shine \x3d texture2D(uTextureDropShine, shinePos);\n            tex \x3d blend(tex,shine);\n            \n            vec4 fg \x3d vec4(tex.rgb, a);\n            gl_FragColor \x3d blend(bg, fg);\n        }\n\t' },
      Application = function () {
        function d() { var a = this; _classCallCheck(this, d); this.width = window.innerWidth; this.height = window.innerHeight; this.loader = PIXI.loader.add("/img/alpha.png").add("/img/shine.png").add("/img/background.jpg").add("/img/foreground.jpg").load(function () { return a.initialize() }) } _createClass(d, [{
          key: "initialize", value: function () {
            var a = this; this.effectCanvas = new EffectCanvas(this.width, this.height, this.loader); window.addEventListener("resize",
              function () { return a.resizeCanvas() }, !1); this.loop()
          }
        }, { key: "resizeCanvas", value: function () { this.width = window.innerWidth; this.height = window.innerHeight; this.effectCanvas.resize(this.width, this.height) } }, { key: "loop", value: function () { var a = this; window.requestAnimationFrame(function () { return a.loop() }); this.effectCanvas.update(this.width, this.height); this.effectCanvas.render() } }]); return d
      }(), EffectCanvas = function () {
        function d(a, c, b) {
          _classCallCheck(this, d); this.renderer = new PIXI.autoDetectRenderer(a,
            c, { antialias: !1, transparent: !1 }); this.renderer.autoResize = !0; document.body.appendChild(this.renderer.view); this.stage = new PIXI.Container; this.background = new PIXI.Graphics; this.background.fillAlphanumber = 0; this.background.beginFill("0xffffff"); this.background.drawRect(0, 0, a, c); this.background.endFill(); this.background.alpha = 0; this.stage.addChild(this.background); this.dropletManager = new DropletManager(this.stage, b); shaderData.uniforms.uTextureDropShine.value = b.resources["/img/shine.png"].texture;
          shaderData.uniforms.uTextureBackground.value = b.resources["/img/background.jpg"].texture; shaderData.uniforms.uTextureForeground.value = b.resources["/img/foreground.jpg"].texture; shaderData.uniforms.vTextureSize.value = [b.resources["/img/background.jpg"].texture.width, b.resources["/img/background.jpg"].texture.height]; this.dropletShader = new PIXI.Filter("", shaderData.fragment, shaderData.uniforms); this.stage.filters = [this.dropletShader]
        }
        _createClass(d, [{ key: "resize", value: function (a, c) { this.renderer.resize(a, c); this.background.clear(); this.background.beginFill("0xffffff"); this.background.drawRect(0, 0, a, c); this.background.endFill() } }, { key: "update", value: function (a, c) { this.updateShader(a, c); this.dropletManager.update(a, c) } }, { key: "updateShader", value: function (a, c) { this.dropletShader.uniforms.iResolution = [a, c] } }, { key: "render", value: function () { this.renderer.render(this.stage) } }]); return d
      }(), DropletManager = function () {
        function d(a, c) {
          _classCallCheck(this,
            d); var b = 9E3, e = 200; 700 > a.width && (b = 3E3, e = 150); this.options = { spawnRate: { small: .6, large: .05 }, spawnsPerFrame: { small: 200, large: 5 }, spawnMass: { small: { min: 1, max: 2 }, large: { min: 7, max: 10 } }, poolDroplets: { small: { min: b - 500, max: b }, large: { min: e - 100, max: e } }, maximumMassGravity: 15, maximumMass: 15, dropletGrowSpeed: 1, dropletShrinkSpeed: 2, dropletContainerSize: 100 }; this.positionMatrix = [[-1, -1], [1, -1], [-1, 1], [1, 1]]; this.smallDroplets = []; this.largeDroplets = []; this.dropletSmallTexture = c.resources["/img/alpha.png"].texture;
          this.dropletLargeTexture = c.resources["/img/alpha.png"].texture; this.smallDropletContainer = new DropletPool(Droplet, this.dropletSmallTexture, this.options.poolDroplets.small.min, this.options.poolDroplets.small.max); this.largeDropletContainer = new DropletPool(LargeDroplet, this.dropletLargeTexture, this.options.poolDroplets.large.min, this.options.poolDroplets.large.max); a.addChild(this.largeDropletContainer); a.addChild(this.smallDropletContainer)
        } _createClass(d, [{
          key: "update", value: function (a,
            c) { d.removeLargeOffscreenDroplets(a, c, this.largeDroplets, this.largeDropletContainer); for (var b = 0; b < this.options.spawnsPerFrame.small; b++)this.spawnNewSmallDroplet(a, c); for (b = 0; b < this.options.spawnsPerFrame.large; b++)this.spawnNewLargeDroplet(a, c); this.checkLargeDropletLogic() }
        }, {
          key: "checkLargeDropletLogic", value: function () {
            for (var a = this.largeDroplets.length - 1; 0 <= a; a--)this.updateLargeDropletSize(this.largeDroplets[a]), this.checkDropletMovement(this.largeDroplets[a]), this.checkLargeToSmallDropletCollision(this.largeDroplets[a]),
              this.checkLargeToLargeDropletCollision(this.largeDroplets[a]), this.removeLargeDroplets(a)
          }
        }, { key: "removeLargeDroplets", value: function (a) { 0 === this.largeDroplets[a].mass && !0 === this.largeDroplets[a].toBeRemoved && (this.largeDropletContainer.destroy(this.largeDroplets[a]), this.largeDroplets.splice(a, 1)) } }, { key: "updateLargeDropletSize", value: function (a) { !0 === a.toBeRemoved ? this.shrinkDropletSize(a) : this.growDropletSize(a); a.width = 6 * a.mass; a.height = 7 * a.mass } }, {
          key: "shrinkDropletSize", value: function (a) {
            a.mass =
            0 >= a.mass - this.options.dropletShrinkSpeed ? 0 : a.mass - this.options.dropletShrinkSpeed
          }
        }, { key: "growDropletSize", value: function (a) { a.mass !== a.targetMass && (a.mass = a.mass + this.options.dropletGrowSpeed >= a.targetMass ? a.targetMass : a.mass + this.options.dropletGrowSpeed) } }, {
          key: "checkDropletMovement", value: function (a) {
            !0 !== a.toBeRemoved && (a.mass < this.options.maximumMassGravity && 0 === a.dropletVelocity.y && 0 === a.dropletVelocity.x ? .01 > Math.random() && (a.dropletVelocity.y = Utils.getRandomInt(.5, 3)) : a.mass < this.options.maximumMassGravity &&
              0 !== a.dropletVelocity.y ? (.1 > Math.random() && (a.x += Utils.getRandomInt(-10, 10) / 10), .1 > Math.random() && (a.dropletVelocity.y = 0)) : a.mass >= this.options.maximumMassGravity && 10 > a.dropletVelocity.y && (a.dropletVelocity.y = Utils.getRandomInt(10, 20), a.dropletVelocity.x = Utils.getRandomInt(-10, 10) / 10), a.y += a.dropletVelocity.y, a.x += a.dropletVelocity.x)
          }
        }, {
          key: "getDropletPresenceArray", value: function (a) {
            for (var c = [], b = this.positionMatrix.length, e = 0; e < b; e++) {
              var d = {
                x: Math.floor((a.x + a.width / 7 * this.positionMatrix[e][0]) /
                  this.options.dropletContainerSize), y: Math.floor((a.y + a.height / 7 * this.positionMatrix[e][1]) / this.options.dropletContainerSize)
              }; 0 === e ? c.push(d) : c[0].x === d.x && c[0].y === d.y || c.push(d)
            } return c
          }
        }, {
          key: "checkLargeToLargeDropletCollision", value: function (a) {
            if (!0 !== a.toBeRemoved) for (var c = this.largeDroplets.length - 1; 0 <= c; c--)if (a.x !== this.largeDroplets[c].x || a.y !== this.largeDroplets[c].y) {
              var b = a.x - this.largeDroplets[c].x, d = a.y - this.largeDroplets[c].y; Math.sqrt(b * b + d * d) <= a.width / 7 + this.largeDroplets[c].width /
                7 && (a.targetMass = a.mass + this.largeDroplets[c].mass <= this.options.maximumMass ? a.mass + this.largeDroplets[c].mass : this.options.maximumMass, this.largeDroplets[c].toBeRemoved = !0)
            }
          }
        }, {
          key: "checkLargeToSmallDropletCollision", value: function (a) {
            if (!0 !== a.toBeRemoved) for (var c = this.getDropletPresenceArray(a), b = 0; b < c.length; b++)if ("undefined" !== typeof this.smallDroplets[c[b].x] && "undefined" !== typeof this.smallDroplets[c[b].x][c[b].y]) for (var d = this.smallDroplets[c[b].x][c[b].y].length - 1; 0 <= d; d--) {
              var f = a.x -
                this.smallDroplets[c[b].x][c[b].y][d].x, g = a.y - this.smallDroplets[c[b].x][c[b].y][d].y; Math.sqrt(f * f + g * g) <= a.width / 7 + this.smallDroplets[c[b].x][c[b].y][d].width / 7 && (a.mass + this.smallDroplets[c[b].x][c[b].y][d].mass / 3 <= this.options.maximumMass && (a.targetMass = a.mass + this.smallDroplets[c[b].x][c[b].y][d].mass / 3), this.smallDropletContainer.destroy(this.smallDroplets[c[b].x][c[b].y][d]), this.smallDroplets[c[b].x][c[b].y].splice(d, 1))
            }
          }
        }, {
          key: "spawnNewSmallDroplet", value: function (a, c) {
            if (!(Math.random() >
              this.options.spawnRate.small)) {
                var b = this.smallDropletContainer.get(); if (null !== b) {
                  a = Utils.getRandomInt(0, a); c = Utils.getRandomInt(0, c); var d = Utils.getRandomInt(this.options.spawnMass.small.min, this.options.spawnMass.small.max), f = Math.floor(a / this.options.dropletContainerSize), g = Math.floor(c / this.options.dropletContainerSize); b.x = a; b.y = c; b.mass = d; b.width = 8 * b.mass; b.height = 8 * b.mass; "undefined" === typeof this.smallDroplets[f] && (this.smallDroplets[f] = []); "undefined" === typeof this.smallDroplets[f][g] &&
                    (this.smallDroplets[f][g] = []); this.smallDroplets[f][g].push(b)
                }
            }
          }
        }, { key: "spawnNewLargeDroplet", value: function (a, c) { if (!(Math.random() > this.options.spawnRate.large)) { var b = this.largeDropletContainer.get(); if (null !== b) { var d = Utils.getRandomInt(this.options.spawnMass.large.min, this.options.spawnMass.large.max); b.x = Utils.getRandomInt(0, a); b.y = Utils.getRandomInt(-100, c / 1.5); b.mass = d / 2; b.targetMass = d; b.width = 6 * b.mass; b.height = 7 * b.mass; b.dropletVelocity.x = 0; b.toBeRemoved = !1; this.largeDroplets.push(b) } } } }],
          [{ key: "removeLargeOffscreenDroplets", value: function (a, c, b, d) { for (var f = b.length - 1; 0 <= f; f--)if (b[f].x > a + 10 || -10 > b[f].x || b[f].y > c + 10 || -100 > b[f].y) d.destroy(b[f]), b.splice(f, 1) } }]); return d
      }(), DropletPool = function (d) {
        function a(c, b, d, f) {
          _classCallCheck(this, a); var e = _possibleConstructorReturn(this, (a.__proto__ || Object.getPrototypeOf(a)).call(this, f, { scale: !0, position: !0, rotation: !1, uvs: !1, alpha: !1 })); e.ObjectToCreate = c; e.objectTexture = b; e.pool = []; e.inUse = 0; e.startingSize = d; e.maximumSize = f; e.initialize();
          return e
        } _inherits(a, d); _createClass(a, [{ key: "initialize", value: function () { for (var a = 0; a < this.startingSize; a += 1) { var b = new this.ObjectToCreate(this.objectTexture); b.x = -100; b.y = -100; b.anchor.set(.5); this.addChild(b); this.pool.push(b) } } }, { key: "get", value: function () { if (this.inUse >= this.maximumSize) return null; this.inUse++; if (0 < this.pool.length) return this.pool.pop(); var a = new this.ObjectToCreate(this.objectTexture); a.x = -100; a.y = -100; a.anchor.set(.5, .5); this.addChild(a); return a } }, {
          key: "destroy", value: function (a) {
            0 >
            this.inUse - 1 ? console.error("Something went wrong, you cant remove more elements than there are in the total pool") : (a.x = -100, a.y = -100, --this.inUse, this.pool.push(a))
          }
        }]); return a
      }(PIXI.particles.ParticleContainer), Droplet = function (d) { function a(c) { _classCallCheck(this, a); c = _possibleConstructorReturn(this, (a.__proto__ || Object.getPrototypeOf(a)).call(this, c)); c.mass = 0; return c } _inherits(a, d); return a }(PIXI.Sprite), LargeDroplet = function (d) {
        function a(c) {
          _classCallCheck(this, a); c = _possibleConstructorReturn(this,
            (a.__proto__ || Object.getPrototypeOf(a)).call(this, c)); c.dropletVelocity = new PIXI.Point(0, 0); c.toBeRemoved = !1; c.targetMass = 0; return c
        } _inherits(a, d); return a
      }(Droplet), Utils = function () { function d() { _classCallCheck(this, d) } _createClass(d, null, [{ key: "getRandomInt", value: function (a, c) { return Math.floor(Math.random() * (c - a + 1)) + a } }]); return d }(); new Application;