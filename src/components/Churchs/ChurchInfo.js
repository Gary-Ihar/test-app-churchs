import React from "react";

const ChurchInfo = (props) => {
  const { city, adress, phone, webSite } = props.churchInfo;
  return (
    <div className="churchs">
      <p>City: {city}</p>
      <p>Adress: {adress}</p>
      <p>
        Phone: <a href={`tel:${phone}`}>{phone}</a>
      </p>
      <p>
        Web-site: <a href={webSite}>{webSite}</a>
      </p>
    </div>
  );
};

export default ChurchInfo;
