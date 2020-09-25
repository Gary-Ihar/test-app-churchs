import React, { useState, useCallback } from "react";

const SearchForm = (props) => {
  const [city, setCity] = useState("");
  const onChange = useCallback((e) => {
    const { name, value } = e.target;

    setCity({ [name]: value });
  }, []);
  return (
    <form onSubmit={(e) => props.onSubmit(e, city.searchCity)}>
      <input onChange={onChange} name="searchCity" />
    </form>
  );
};

export default SearchForm;
