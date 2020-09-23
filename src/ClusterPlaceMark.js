import React from "react";
import { Placemark, Clusterer } from "react-yandex-maps";

const test = (props) => {
  console.log(props.churchs);

  return (
    <Clusterer
      options={{
        preset: "islands#invertedVioletClusterIcons",
        groupByCoordinates: false,
      }}
    >
      {props.churchs.map((church, i) => {
        let color;
        if (!church.target) {
          color = "islands#blueDotIcon";
        } else {
          color = "islands#redDotIcon";
        }
        return (
          <Placemark
            key={i}
            onClick={() => props.selectChurch(church)}
            geometry={church.coordinates}
            options={{
              preset: color,
            }}
          />
        );
      })}
    </Clusterer>
  );
};

export default test;
