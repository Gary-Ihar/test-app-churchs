import React, { Component } from "react";
import { YMaps, Map } from "react-yandex-maps";
import axios from "axios";
import ClusterPlaceMark from "./ClusterPlaceMark";
import ChurchInfo from "./ChurchInfo";
import SearchForm from "./SearchForm";

export default class MainMap extends Component {
  state = {
    churchs: [],
    selectedChurchs: false,
    mapCenterCoor: [-73.935242, 40.73061],
    flagForClusterRender: true,
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
      ch.target =
        ch.phone === item.phone &&
        ch.name === item.name &&
        ch.adress &&
        item.adress;
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
  onSubmit = async (e, newCityName) => {
    e.preventDefault();
    let mapCenterCoor; // координаты центра города, который будем искать
    await axios
      .get(`http://search.maps.sputnik.ru/search/addr?q=${newCityName}`) // запрос за городом
      .then(
        (res) =>
          (mapCenterCoor =
            res.data.result.address[0].features[0].geometry.geometries[0] //features[0] - массив с городом, если он не один(тестировал на Boston), то длина массива увеличивается. Это момент тут не продуман.
              .coordinates)
      )
      .then((res) => {
        this.setState({ flagForClusterRender: false }); //из-за кластеризации необходимо полностью перерисовать компонент
      })

      .catch((error) => {
        alert("Такого города нет");
        mapCenterCoor = [
          this.state.mapCenterCoor[0],
          this.state.mapCenterCoor[1],
        ];
      });
    axios // тут уже запрос за церквями
      .get(
        `https://apiv4.updateparishdata.org/Churchs/?lat=${mapCenterCoor[1]}&long=${mapCenterCoor[0]}&pg=1`
      )
      .then((res) => {
        let churchs = res.data.map((item) => {
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

        this.setState({ churchs, mapCenterCoor, flagForClusterRender: true }); // flagForClusterRender: true - необходимость для чистки кластера
      });
  };
  render() {
    return (
      <>
        {/* Яндекс карта */}
        <YMaps>
          <>
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
              {/* Кластер необходимо чистить, поэтому перерисовываю его полностью */}
              {this.state.flagForClusterRender && (
                <ClusterPlaceMark
                  churchs={this.state.churchs}
                  selectChurch={this.onClick}
                />
              )}
            </Map>
          </>
        </YMaps>
        {/* Информация о выбранном городе */}
        {this.state.selectedChurchs && (
          <ChurchInfo churchInfo={this.state.selectedChurchs} />
        )}
        {/* Форма(инпут) поиска города */}
        <SearchForm onSubmit={this.onSubmit} />
      </>
    );
  }
}
