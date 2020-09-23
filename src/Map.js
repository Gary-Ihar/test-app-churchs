import React, { Component } from "react";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import axios from "axios";
import Test from "./test";

//const KEY = "dc8c4f86-ef35-4cbd-ae74-1f6044cdc950";
export default class MainMap extends Component {
  state = {
    churchs: [],
    selectedChurchs: false,
    searchCity: "",
    mapCenterCoor: [-73.935242, 40.73061],
    testFlag: true,
  };
  componentDidMount() {
    let churchs = [];
    axios
      .get(
        `https://apiv4.updateparishdata.org/Churchs/?lat=40.73061&long=-73.935242&pg=1`
      )
      .then((res) => {
        churchs = res.data.map((item) => {
          return {
            target: false,
            city: item.church_address_providence_name,
            name: item.name,
            adress: item.church_address_street_address,
            phone: item.phone_number,
            webSite: item.url,
            coordinates: [item.latitude, item.longitude],
          };
        });

        this.setState({ churchs });
      });
  }

  onClick = (item) => {
    let churchs = [...this.state.churchs].map((ch) => {
      ch.target = ch.phone === item.phone;
      return ch;
    });
    const selectedChurchs = {
      city: item.city,
      adress: item.adress,
      phone: item.phone,
      webSite: item.webSite,
    };
    this.setState({
      selectedChurchs,
      mapCenterCoor: [item.coordinates[1], item.coordinates[0]],
      churchs,
    });
  };
  searchCity = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  onSubmit = async (e) => {
    e.preventDefault();
    let mapCenterCoor;
    await axios
      .get(
        `http://search.maps.sputnik.ru/search/addr?q=${this.state.searchCity}`
      )
      .then(
        (res) =>
          (mapCenterCoor =
            res.data.result.address[0].features[0].geometry.geometries[0] //features[0] - массив с городом, если он не один(тестировал на Boston), то длина массива увеличивается. Это момент тут не продуман.
              .coordinates)
      )
      .then((res) => {
        console.log("false");
        this.setState({ testFlag: false });
      })

      .catch((error) => {
        alert("Такого города нет");
        mapCenterCoor = [
          this.state.mapCenterCoor[0],
          this.state.mapCenterCoor[1],
        ];
      });
    axios
      .get(
        `https://apiv4.updateparishdata.org/Churchs/?lat=${mapCenterCoor[1]}&long=${mapCenterCoor[0]}&pg=1`
      )
      .then((res) => {
        let churchs;
        churchs = res.data.map((item) => {
          return {
            target: false,
            city: item.church_address_providence_name,
            name: item.name,
            adress: item.church_address_street_address,
            phone: item.phone_number,
            webSite: item.url,
            coordinates: [item.latitude, item.longitude],
          };
        });

        this.setState({ churchs, mapCenterCoor, testFlag: true });
      });
  };
  render() {
    return (
      <>
        <YMaps>
          <div>
            <Map
              style={{ width: "100vw", height: "100vh" }}
              state={{
                center: [
                  this.state.mapCenterCoor[1],
                  this.state.mapCenterCoor[0],
                ],
                zoom: 13,
              }}
            >
              {this.state.testFlag && (
                <Test
                  churchs={this.state.churchs}
                  selectChurch={this.onClick}
                />
              )}
            </Map>
          </div>
        </YMaps>
        {this.state.selectedChurchs && (
          <div className="churchs">
            <p>City: {this.state.selectedChurchs.city}</p>
            <p>Adress: {this.state.selectedChurchs.adress}</p>
            <p>
              Phone:{" "}
              <a href={`tel:${this.state.selectedChurchs.phone}`}>
                {this.state.selectedChurchs.phone}
              </a>
            </p>
            <p>
              Web-site:{" "}
              <a href={this.state.selectedChurchs.webSite}>
                {this.state.selectedChurchs.webSite}
              </a>
            </p>
          </div>
        )}
        <form onSubmit={this.onSubmit}>
          <input onChange={this.searchCity} name="searchCity" />
        </form>
      </>
    );
  }
}
