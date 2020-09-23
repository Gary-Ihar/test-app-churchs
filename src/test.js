import React from "react";
import { Placemark, Clusterer } from "react-yandex-maps";

const test = (props) => {
  console.log(props);
  return (
    <Clusterer
      options={{
        preset: "islands#invertedVioletClusterIcons",
        groupByCoordinates: false,
      }}
    >
      {props.churchs.map((item, i) => (
        <Placemark
          key={i}
          onClick={() => props.selectChurch(item)}
          geometry={item.coordinates}
        />
      ))}
    </Clusterer>
  );
};

export default test;
