import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview',
  template: `
    <br />
    <h2>Soft WiSARD overview:</h2>
    <br />

    <p>The basic purpose of WISARD is to indentify the contents of a scene.</p>

    <p>WISARD contains a collection of classifiers.
    A classifier can be thought of as a black box.
    A classifier is shown a scene and told to memorise the features within it,
    a classifier is then be shown another scene and asked to report the number of features detected.</p>

    <p>WISARD contains a classifier for each 'type' of scene it wants to recognise.
    When shown an unknown scene it presents this scene to all its classifiers
    and then uses their reports to identify the most likely 'type' of scene.</p>

    <p>The diagram below shows an overview of the Soft WISARD implementation.</p>

    <p style="text-align:center;">
    <img src="./assets/images/overview.jpg" alt="Soft WiSARD overview" width="80%">

    <p>The diagram above has three major sections, top, middle and bottom.</p>

    <p>The top section contains the common processing pipeline that prepares the image for training and recognition.</p>

    <p>The middle section contains a group of classifiers.
    Each classifier contains a short pipeline for storage, matching and scoring the features.</p>

    <p>The bottom part of the diagram is where the scores from the classifiers are collated
    to make a decision.</p>

    <br>
    <h2>Soft WISARD parts</h2>
    <br/>

    <dl>
      <dt>Source</dt>
      <dd>This stage takes imagery into the pipeline.</dd>

      <dt>View</dt>
      <dd>This stage creates a window that can be moved, scaled or rotated within the Source.</dd>

      <dt>Threshold</dt>
      <dd>This stage converts the coloured image into a binary image.</dd>

      <dt>Scramble</dt>
      <dd>This stage scrambles the binary image, this ensures that features are made up of
      randomly chosen points from within the View.</dd>

      <dt>Features</dt>
      <dd>This stage sequentially breaks up the scrambled image into small clusters of bits,
      these small clusters we'll call 'features'.<br/>
      A feature is a group of randomly chosen points from with the view.<br/>
      A feature can be used as an RAM address,
      the addressed location in each RAM is written to during training
      and read from during testing.</dd>

      <dt>Decoder (optional)</dt>
      <dd>This stage can be used to view how the input image has been
      converted into an array of features,
      and how these features address locations within the array of RAMs.</dd>

      <dt>Store 'n'</dt>
      <dd>The store is a collection of RAMs.<br/>
      This stage is used to record features that were present during the training phase.<br/>
      During the training phase the features are used to identify which RAM locations will be written to.<br>
      During the testing phase the features are used to identify which RAM locations will be read from.</dd>

      <dt>Match 'n'</dt>
      <dd>During the testing phase this shows which features within the classifier have be recognised.</dd>

      <dt>Score 'n'</dt>
      <dd>During the testing phase this shows how many features within the classifier have been recognised.</dd>

      <dt>Result</dt>
      <dd>This shows the decision made by the group of classifiers.</dd>

      <br/>
    </dl>
  `,
  styles: []
})
export class OverviewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
