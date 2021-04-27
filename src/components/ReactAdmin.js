import React from "react";
import { Admin, ListGuesser, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import PurchaseList from "./PurchasesList";

const getList = async (resource, params) => {
  const { page, perPage } = params.pagination;
  const { q } = params.filter;

  const apiUrl = process.env.REACT_APP_API_URL;

  // Pagination and sort
  let query = `limit=${perPage}&page=${page}`;
  // Filter?
  let useResource = "";
  let useFilter = "";

  if (q == null) {
    // No filter: Use <resource>/ url
    useResource = resource;
  } else {
    // Filter: Use append url with /find
    useResource = `${resource}/find`;
    useFilter = q;
    console.log("useFilter: ", useFilter);
    query += `&searchText=${useFilter}`;
  }

  const url = `${apiUrl}/${useResource}?${query}`;

  const response = await fetch(url);
  return await response.body.json();
};

const dataProvider = jsonServerProvider(process.env.REACT_APP_API_URL);
dataProvider.getList = getList;

const ReactAdmin = () => {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="purchases" list={PurchaseList} />
    </Admin>
  );
};

export default ReactAdmin;
