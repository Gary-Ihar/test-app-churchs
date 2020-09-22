import React, { Component } from "react";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import axios from "axios";

//const KEY = "dc8c4f86-ef35-4cbd-ae74-1f6044cdc950";
export default class MainMap extends Component {
  state = {
    churchs: [],
    selectedChurchs: false,
    searchCity: "",
    mapCenterCoor: [-73.935242, 40.73061],
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
    const selectedChurchs = {
      city: item.city,
      adress: item.adress,
      phone: item.phone,
      webSite: item.webSite,
    };
    this.setState({ selectedChurchs });
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
      .catch((error) => (mapCenterCoor = [-73.935242, 40.73061]));
    axios
      .get(
        `https://apiv4.updateparishdata.org/Churchs/?lat=${mapCenterCoor[1]}&long=${mapCenterCoor[0]}&pg=1`
      )
      .then((res) => {
        let churchs;
        churchs = res.data.map((item) => {
          return {
            city: item.church_address_providence_name,
            name: item.name,
            adress: item.church_address_street_address,
            phone: item.phone_number,
            webSite: item.url,
            coordinates: [item.latitude, item.longitude],
          };
        });
        this.setState({ churchs, mapCenterCoor });
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
              {this.state.churchs.length > 0 &&
                this.state.churchs.map((item, i) => (
                  <Placemark
                    key={i}
                    geometry={item.coordinates}
                    onClick={() => this.onClick(item)}
                    options={{ preset: "islands#blueDotIcon" }}
                  />
                ))}
            </Map>
          </div>
        </YMaps>
        {this.state.selectedChurchs && (
          <div className="churchs">
            <p>City: {this.state.selectedChurchs.city}</p>
            <p>Adress: {this.state.selectedChurchs.adress}</p>
            <p>Phone: {this.state.selectedChurchs.phone}</p>
            <p>Web-site: {this.state.selectedChurchs.webSite}</p>
          </div>
        )}
        <form onSubmit={this.onSubmit}>
          <input onChange={this.searchCity} name="searchCity" />
        </form>
      </>
    );
  }
}
