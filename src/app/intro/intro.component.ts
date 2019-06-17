import { Component, OnInit } from '@angular/core';
// tslint:disable:max-line-length
@Component({
  selector: 'app-intro',
  template: `
    <br />
    <h2>Introduction to WISARD:</h2>
    <br />

    <p><a target="_blank" href="https://en.wikipedia.org/wiki/RAMnets#RAM-discriminators_and_WiSARD"
    >WISARD</a> is an early example of a hardware neural network pattern recognition machine (1981).</p>

    <p>WISARD was designed and built by Bruce Wilkie
    at Brunel University as part of his Phd project
    with the backing of Professor Igor Aleksander
    and Dr John Stonham.</p>

    <p>WISARD was a hardware machine that used a
    parallel architecture to run at video frame rates.</p>

    <p>WISARD is on display at the London Science Museum
    in the
    <a target="_blank"
    href="https://www.sciencemuseum.org.uk/learning/mathematics-winton-gallery-school-info">Winton Gallery</a>.</p>

    <p style="text-align:center;">
    <img src="./assets/images/wisard.jpg" alt="WISARD at the Science Museum in London." width="80%">

    <p>WISARD used Random Access Memories
    (<a target="_blank" href="https://en.wikipedia.org/wiki/Random-access_memory">RAMs</a>)
    to emulate a simplistic neuron.</p>

    <p style="text-align:center;">
    <img src="./assets/images/neuron_ram.jpg" alt="Soft WiSARD overview" width="80%">

    <p>The diagram above shows a simplified view of a neuron.
    The inputs are attached to other neurons via <b>dendrites</b>,
    it processes its inputs within the <b>neucleus</b>,
    and the output is delivered to other neurons via the <b>axon</b>.</p>

    <p>WISARD used RAMs to emulate a simplistic neuron.
    The inputs are attached to the scene being recognised,
    the processing is performed using a programmable (teachable) lookup table (RAM).
    A collection of inputs can be treated as an address that is used to locate
    a pigeon hole within each RAM.
    The output contains the stored contents of each pigeon hole being addressed.</p>

    <p>WISARD used thousands of RAMs to store and recognise each scene.
    The hardware treated a single RAM as a crude feature detector to
    handle part of the scene, but it used thousands of these feature detectors
    to handle the whole scene and produced a more reliable result.</p>

    <p>This site does not attempt to describe how the original WISARD hardware worked,
    instead it describes a software simulation of WISARD. It will walk you through
    all of the internal stages and finally demonstate a working system.</p>

    <p>This software simulation runs within your browser,
    it uses JavaScript,
    which would normally be much slower than the original WISARD hardware,
    however it alsp uses the WebGL
    <a target="_blank" href="https://en.wikipedia.org/wiki/OpenGL_Shading_Language">Shading Language</a>
    to perform most of the processing steps within your computer's graphic card,
    this should make it run much faster than if it was using pure JavaScript.</p>

    <p>This software was written as an experiment in WebGL and the Shading Language.</p>

    <p>WebGL is normally used for 3D rendering,
    however that does not exclude its 2D use,
    as demonstrated by this project.</p>

    <p>A runnable demo can be found at:
    <a target="_blank" href="https://malcolmbinstead.github.io/wisard/">demo</a>.</p>

    <p>And the source code can be found at:
    <a target="_blank" href="https://github.com/malcolmbinstead/wisard/">src</a>.</p>

    <p>Please note that this demo requires that you are using
    a browser and a display card that supports WebGL2.</p>
    <br/>
    `,
  styles: []
})
export class IntroComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
