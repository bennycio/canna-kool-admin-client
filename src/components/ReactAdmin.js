import React from 'react';
import { Admin, ListGuesser, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import PurchaseList from './PurchasesList';

const dataProvider = jsonServerProvider(process.env.REACT_APP_API_URL);

const ReactAdmin = () => {
  return (
  <Admin dataProvider={dataProvider} >
      <Resource name="purchases" list={PurchaseList}/>
  </Admin>
  );
}

export default ReactAdmin