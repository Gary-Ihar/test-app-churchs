import React from "react";
import { Placemark, Clusterer } from "react-yandex-maps";

const test = (props) => {
  return (
    <Clusterer
      options={{
        preset: "islands#invertedVioletClusterIcons",
        groupByCoordinates: false,
      }}
    >
      {props.churchs.map((church, i) => (
        <Placemark
          key={i}
          onClick={() => props.selectChurch(church)}
          geometry={church.coordinates}
        />
      ))}
    </Clusterer>
  );
};

export default test;
